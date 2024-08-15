<?php

namespace App\Http\Controllers\Sale;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Helpers\MySettingHelper;
use App\Helpers\StockManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sale\StoreSaleRequest;
use App\Http\Requests\Sale\UpdateSaleRequest;
use App\Models\Customer;
use App\Models\ProductBatch;
use App\Models\ProductWarehouse;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleItemBatch;
use App\Models\Unit;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SaleController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('sale.index');
        $limit = 10;
        $saleQuery = Sale::query()
            ->where('finance_year_id', Auth::user()->mySetting->default_finance_year)
            ->with(['customer', 'financeYear', 'warehouse']);
        $sales = $saleQuery->latest()->paginate($limit)->withQueryString();
        return Inertia::render('Sale/List', [
            'sales' => $sales,
            'saleCount' => Sale::count(),
            'breadcrumb' => Breadcrumbs::generate('sale.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('sale.create');
        return Inertia::render('Sale/Create', [
            'customers' => $this->getFormateCustomer(),
            'defaultCustomer' => $this->getDefaultCustomer(),
            'warehouseProducts' => StockManager::getAllWarehouseStock(),
            'breadcrumb' => Breadcrumbs::generate('sale.create')
        ]);
    }

    public function store(StoreSaleRequest $request)
    {
        $this->authorizeOrFail('sale.create');
        try {
            DB::transaction(function () use ($request) {
                $customer = Customer::with('customerGroup')->findOrFail($request->customer);
                $customerGroup = $customer->customerGroup;
                $saleSubTotal = SaleHelper::calculateSubTotal($request->sale_items, $customerGroup->calculate_rate);
                $appliedTax = $saleSubTotal * ($request->order_tax / 100);
                $saleSubTotalAppliedTaxPrice = $saleSubTotal + $appliedTax;
                $finalPrice = $request->discount_method === 0
                    ? $saleSubTotalAppliedTaxPrice - (double) $request->discount
                    : $saleSubTotalAppliedTaxPrice - ($saleSubTotalAppliedTaxPrice * ((double) $request->discount / 100));
                $saleData = [
                    'invoice_id' => $this->generateUniqueInvoiceId(),
                    'date' => $request->date,
                    'customer_id' => $request->customer,
                    'finance_year_id' => MySettingHelper::getMySetting()->default_finance_year,
                    'warehouse_id' => $request->warehouse,
                    'total_cost' => $saleSubTotal,
                    'discount_method' => $request->discount_method,
                    'discount' => $request->discount,
                    'total_tax' => $appliedTax,
                    'tax_rate' => $request->order_tax,
                    'shipping_cost' => $request->shipping_cost,
                    'other_cost' => $request->other_cost,
                    'grand_total' => $finalPrice + $request->shipping_cost + $request->other_cost,
                    'paid_amount' => 0,
                    'order_status' => $request->order_status,
                    'payment_status' => PaymentStatusEnum::PENDING,
                    'note' => $request->note ?? "no notes",
                    'user_id' => Auth::id(),
                ];
                $sale = Sale::create($saleData);
                $currentTime = Carbon::now();
                foreach ($request->sale_items as $saleItem) {

                    $saleUnit = Unit::find($saleItem['sale_unit']['id']);
                    $saleQuantity = $saleUnit->operator == "/"
                        ? $saleItem['quantity'] / $saleUnit->operator_value
                        : $saleItem['quantity'] * $saleUnit->operator_value;


                    $data = [
                        'sale_id' => $sale->id,
                        'product_warehouse_id' => $saleItem['stock_id'],
                        'sale_unit_id' => $saleItem['sale_unit']['id'],
                        'net_unit_price' => $saleItem['original_price'],
                        'calculate_rate' => $customerGroup->calculate_rate,
                        'quantity' => $saleQuantity,
                        'discount_method' => $saleItem['discount_method'],
                        'discount' => $saleItem['discount'],
                        'tax_method' => $saleItem['tax_method'],
                        'tax_rate' => $saleItem['tax_rate'],
                        'sub_total' => SaleHelper::itemSubTotal($saleItem, $customerGroup->calculate_rate),
                        'created_at' => $currentTime,
                        'updated_at' => $currentTime,
                    ];
                    if ($saleItem['is_batch'] !== 0 && !is_null($saleItem['batch_id'])) {
                        $data['product_batch_id'] = $saleItem['batch_id'];
                    }
                    $insertedSaleItem = SaleItem::create($data);
                    if ($request->order_status === OrderStatusEnum::RECEIVED) {
                        // Stock out from productWarehouse
                        StockManager::stockOut(
                            ProductWarehouse::where('id', $saleItem['stock_id'])->first(),
                            $insertedSaleItem->quantity
                        );
                        // If item has a batch, stock out from batch
                        if ($saleItem['is_batch'] !== 0 && !is_null($saleItem['batch_id'])) {
                            $prefBatch = ProductBatch::find($saleItem['batch_id']);
                            $productWarehouse = ProductWarehouse::where('id', $saleItem['stock_id'])->with([
                                'batches' => function ($query) use ($prefBatch) {
                                    $query->where('id', '!=', $prefBatch->id)
                                        ->where('quantity', '>', 0)
                                        ->orderBy('expiration', 'ASC');
                                }
                            ])->first();
                            $requiredQuantity = $insertedSaleItem->quantity;
                            $requiredRemainQnt = $requiredQuantity > $prefBatch->quantity
                                ? $requiredQuantity - $prefBatch->quantity
                                : 0;
                            if ($requiredRemainQnt > 0) {
                                $rQuantity = $requiredQuantity - $prefBatch->quantity;
                                foreach ($productWarehouse->batches as $batch) {
                                    if ($rQuantity > 0) {
                                        $usedQnt = 0;
                                        if ($rQuantity < $batch->quantity) {
                                            $usedQnt = $rQuantity;
                                            $rQuantity = 0;
                                        } else {
                                            $usedQnt = $batch->quantity;
                                            $rQuantity -= $batch->quantity;
                                        }
                                        SaleItemBatch::create([
                                            'sale_item_id' => $insertedSaleItem->id,
                                            'product_batch_id' => $batch->id,
                                            'quantity' => $usedQnt,
                                        ]);
                                        $batch->update([
                                            'quantity' => $batch->quantity - $usedQnt
                                        ]);
                                    }
                                }
                                SaleItemBatch::create([
                                    'sale_item_id' => $insertedSaleItem->id,
                                    'product_batch_id' => $prefBatch->id,
                                    'quantity' => $prefBatch->quantity + $rQuantity,
                                ]);
                                //if rQuantity is  > available quantity then update prefer batch to minus
                                $prefBatch->update([
                                    'quantity' => 0 - $rQuantity
                                ]);
                            } else {
                                SaleItemBatch::create([
                                    'sale_item_id' => $insertedSaleItem->id,
                                    'product_batch_id' => $prefBatch->id,
                                    'quantity' => $requiredQuantity,
                                ]);
                                $prefBatch->update([
                                    'quantity' => $prefBatch->quantity - $requiredQuantity
                                ]);
                            }

                        }
                    }
                }
            }, 10);
            return redirect()->route('sale.index')->with('success', "sale created successfully");
        } catch (\Exception $e) {
            Log::channel('custom')->error("Failed to create sale", ['error' => $e->getMessage()]);
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $this->authorizeOrFail('sale.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        $this->authorizeOrFail('sale.edit');
        $saleData = Sale::where('id', $sale->id)->with([
            'saleItems',
            'saleItems.batches'
        ])->first();
        $saleFormateData = [
            'id' => $saleData->id,
            'date' => $saleData->date,
            'customer_id' => $saleData->customer_id,
            'finance_year_id' => $saleData->finance_year_id,
            'warehouse_id' => $saleData->warehouse_id,
            'total_cost' => $saleData->total_cost,
            'discount_method' => $saleData->discount_method,
            'discount' => $saleData->discount,
            'total_tax' => $saleData->total_tax,
            'tax_rate' => $saleData->tax_rate,
            'shipping_cost' => $saleData->shipping_cost,
            'other_cost' => $saleData->other_cost,
            'grand_total' => $saleData->grand_total,
            'order_status' => $saleData->order_status,
            'note' => $saleData->note,
            'sale_items' => $saleData->saleItems->map(function ($saleItem) use ($saleData) {
                $prefBatch = $saleItem->productWarehouse->product->is_batch
                    ? ProductBatch::find($saleItem->product_batch_id)
                    : null;

                $availableQuantity = $saleItem->saleUnit->operator == "*"
                    ? $saleItem->productWarehouse->quantity / $saleItem->saleUnit->operator_value
                    : $saleItem->productWarehouse->quantity * $saleItem->saleUnit->operator_value;

                $saleQuantity = $saleItem->saleUni == "/"
                    ? $saleItem->quantity / $saleItem->saleUnit->operator_value
                    : $saleItem->quantity * $saleItem->saleUnit->operator_value;

                return (object) [
                    "stock_id" => $saleItem->product_warehouse_id,
                    "product_code" => $saleItem->productWarehouse->product->code,
                    'name' => $saleItem->productWarehouse->product->name,
                    'original_price' => $saleItem->productWarehouse->product->price,
                    'net_unit_price' => $saleItem->net_unit_price,
                    'sale_unit' => $saleItem->saleUnit,
                    'available_units' => $saleItem->productWarehouse->product->getAvailableUnits(),
                    'available' => $availableQuantity,
                    'quantity' => $saleQuantity,
                    'subtotal' => $saleItem->sub_total,
                    'discount_method' => $saleItem->discount_method,
                    'discount' => $saleItem->discount,
                    'tax_method' => $saleItem->tax_method,
                    'tax_rate' => $saleItem->tax_rate,
                    'is_batch' => $saleItem->productWarehouse->product->is_batch,
                    'batch_id' => $prefBatch?->id,
                    'batch_number' => $prefBatch?->batch,
                    'expiration' => $prefBatch?->expiration,
                ];
            }),
        ];
        return Inertia::render('Sale/Edit', [
            'saleDetail' => $saleFormateData,
            'customers' => $this->getFormateCustomer(),
            'warehouseProducts' => StockManager::getAllWarehouseStock(),
            'breadcrumb' => Breadcrumbs::generate('sale.edit', $sale)
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateSaleRequest $request
     * @param Sale $sale
     */
    public function update(UpdateSaleRequest $request, Sale $sale)
    {
        $this->authorizeOrFail('sale.edit');
        try {
            DB::transaction(function () use ($request, $sale) {
                // Restore stock and delete sale items
                if ($sale->order_status === OrderStatusEnum::RECEIVED) {
                    foreach ($sale->saleItems as $item) {
                        // Restore Stock
                        StockManager::stockIn(
                            ProductWarehouse::find($item->product_warehouse_id),
                            $item->quantity
                        );
                        // Restore batch if available
                        if ($item->batches) {
                            foreach ($item->batches as $batch) {
                                StockManager::StockInFromBatch(
                                    ProductBatch::find($batch->product_batch_id),
                                    $batch->quantity
                                );
                                // Delete sale item batch
                                $batch->delete();
                            }
                        }
                        // Delete sale item
                        $item->delete();
                    }
                } else {
                    $sale->saleItems()->delete();
                }
                //update existing sale 
                $customer = Customer::with('customerGroup')->findOrFail($request->customer);
                $customerGroup = $customer->customerGroup;
                $saleSubTotal = SaleHelper::calculateSubTotal($request->sale_items, $customerGroup->calculate_rate);
                $appliedTax = $saleSubTotal * ($request->order_tax / 100);
                $saleSubTotalAppliedTaxPrice = $saleSubTotal + $appliedTax;
                $finalPrice = $request->discount_method === 0
                    ? $saleSubTotalAppliedTaxPrice - (double) $request->discount
                    : $saleSubTotalAppliedTaxPrice - ($saleSubTotalAppliedTaxPrice * ((double) $request->discount / 100));
                $sale->update([
                    'date' => $request->date,
                    'customer_id' => $request->customer,
                    'warehouse_id' => $request->warehouse,
                    'total_cost' => $saleSubTotal,
                    'discount_method' => $request->discount_method,
                    'discount' => $request->discount,
                    'total_tax' => $appliedTax,
                    'tax_rate' => $request->order_tax,
                    'shipping_cost' => $request->shipping_cost,
                    'other_cost' => $request->other_cost,
                    'grand_total' => $finalPrice + $request->shipping_cost + $request->other_cost,
                    'paid_amount' => $sale->paid_amount,
                    'order_status' => $request->order_status,
                    'payment_status' => $sale->payment_status,
                    'note' => $request->note ?? $sale->note,
                    'user_id' => Auth::id(),
                    'updated_at' => Carbon::now()
                ]);
                $currentTime = Carbon::now();
                foreach ($request->sale_items as $saleItem) {

                    $saleUnit = Unit::find($saleItem['sale_unit']['id']);
                    $saleQuantity = $saleUnit->operator == "/"
                        ? $saleItem['quantity'] / $saleUnit->operator_value
                        : $saleItem['quantity'] * $saleUnit->operator_value;

                    $data = [
                        'sale_id' => $sale->id,
                        'product_warehouse_id' => $saleItem['stock_id'],
                        'sale_unit_id' => $saleItem['sale_unit']['id'],
                        'net_unit_price' => $saleItem['original_price'],
                        'calculate_rate' => $customerGroup->calculate_rate,
                        'quantity' => $saleQuantity,
                        'discount_method' => $saleItem['discount_method'],
                        'discount' => $saleItem['discount'],
                        'tax_method' => $saleItem['tax_method'],
                        'tax_rate' => $saleItem['tax_rate'],
                        'sub_total' => SaleHelper::itemSubTotal($saleItem, $customerGroup->calculate_rate),
                        'created_at' => $currentTime,
                        'updated_at' => $currentTime,
                    ];
                    if ($saleItem['is_batch'] !== 0 && !is_null($saleItem['batch_id'])) {
                        $data['product_batch_id'] = $saleItem['batch_id'];
                    }
                    $insertedSaleItem = SaleItem::create($data);
                    if ($request->order_status === OrderStatusEnum::RECEIVED) {
                        // Stock out from productWarehouse
                        StockManager::stockOut(
                            ProductWarehouse::where('id', $saleItem['stock_id'])->first(),
                            $insertedSaleItem->quantity
                        );
                        // If item has a batch, stock out from batch
                        if ($saleItem['is_batch'] !== 0 && !is_null($saleItem['batch_id'])) {
                            $prefBatch = ProductBatch::find($saleItem['batch_id']);
                            $productWarehouse = ProductWarehouse::where('id', $saleItem['stock_id'])->with([
                                'batches' => function ($query) use ($prefBatch) {
                                    $query->where('id', '!=', $prefBatch->id)
                                        ->where('quantity', '>', 0)
                                        ->orderBy('expiration', 'ASC');
                                }
                            ])->first();
                            $requiredQuantity = $insertedSaleItem->quantity;
                            $requiredRemainQnt = $requiredQuantity > $prefBatch->quantity
                                ? $requiredQuantity - $prefBatch->quantity
                                : 0;
                            if ($requiredRemainQnt > 0) {
                                $rQuantity = $requiredQuantity - $prefBatch->quantity;
                                foreach ($productWarehouse->batches as $batch) {
                                    if ($rQuantity > 0) {
                                        $usedQnt = 0;
                                        if ($rQuantity < $batch->quantity) {
                                            $usedQnt = $rQuantity;
                                            $rQuantity = 0;
                                        } else {
                                            $usedQnt = $batch->quantity;
                                            $rQuantity -= $batch->quantity;
                                        }
                                        SaleItemBatch::create([
                                            'sale_item_id' => $insertedSaleItem->id,
                                            'product_batch_id' => $batch->id,
                                            'quantity' => $usedQnt,
                                        ]);
                                        $batch->update([
                                            'quantity' => $batch->quantity - $usedQnt
                                        ]);
                                    }
                                }
                                SaleItemBatch::create([
                                    'sale_item_id' => $insertedSaleItem->id,
                                    'product_batch_id' => $prefBatch->id,
                                    'quantity' => $prefBatch->quantity + $rQuantity,
                                ]);
                                //if rQuantity is  > available quantity then update prefer batch to minus
                                $prefBatch->update([
                                    'quantity' => 0 - $rQuantity
                                ]);
                            } else {
                                SaleItemBatch::create([
                                    'sale_item_id' => $insertedSaleItem->id,
                                    'product_batch_id' => $prefBatch->id,
                                    'quantity' => $requiredQuantity,
                                ]);
                                $prefBatch->update([
                                    'quantity' => $prefBatch->quantity - $requiredQuantity
                                ]);
                            }

                        }
                    }
                }
            }, 10);
            return redirect()->route('sale.index')->with('success', "sale update successfully");
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $this->authorizeOrFail('sale.delete');
        try {
            DB::transaction(function () use ($sale) {
                // Restore stock and delete sale items
                if ($sale->order_status === OrderStatusEnum::RECEIVED) {
                    foreach ($sale->saleItems as $item) {
                        // Restore Stock
                        StockManager::stockIn(
                            ProductWarehouse::find($item->product_warehouse_id),
                            $item->quantity
                        );
                        // Restore batch if available
                        if ($item->batches) {
                            foreach ($item->batches as $batch) {
                                StockManager::StockInFromBatch(
                                    ProductBatch::find($batch->product_batch_id),
                                    $batch->quantity
                                );
                                // Delete sale item batch
                                $batch->delete();
                            }
                        }
                        // Delete sale item
                        $item->delete();
                    }
                } else {
                    $sale->saleItems()->delete();
                }
                $sale->delete();
            }, 10);
            return redirect()->back()->with('success', "sale deleted successfully");
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    protected function generateUniqueInvoiceId()
    {
        $nextId = Sale::max('id') ?? 0;
        do {
            $nextId += 1;
            $invoiceId = 'INV_' . str_pad($nextId, 8, '0', STR_PAD_LEFT);

        } while (Sale::where('invoice_id', $invoiceId)->exists());
        return $invoiceId;
    }
    protected function getFormateCustomer()
    {
        $customers = Customer::with(['customerGroup'])->ofActive(1)->orderBy('name', 'ASC')->get();
        return $customers->map(function ($customer) {
            return (object) [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'groupName' => $customer->customerGroup->name,
                'calculateRate' => $customer->customerGroup->calculate_rate,
            ];
        });
    }
    protected function getDefaultCustomer()
    {
        $defaultCustomer = Customer::where('id', Auth::user()->mySetting->default_customer)->with(['customerGroup'])->first();
        return (object) [
            'id' => $defaultCustomer->id,
            'name' => $defaultCustomer->name,
            'email' => $defaultCustomer->email,
            'phone' => $defaultCustomer->phone,
            'groupName' => $defaultCustomer->customerGroup->name,
            'calculateRate' => $defaultCustomer->customerGroup->calculate_rate,
        ];
    }
}
