<?php

namespace App\Http\Controllers\Sale;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Helpers\MySettingHelper;
use App\Helpers\StockManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sale\StoreSaleRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\ProductWarehouse;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleItemBatch;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
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

        $customers = Customer::with(['customerGroup'])->ofActive(1)->orderBy('name', 'ASC')->get();
        $defaultCustomer = Customer::where('id', Auth::user()->mySetting->default_customer)->with(['customerGroup'])->first();
        $defaultCustomer = [
            'id' => $defaultCustomer->id,
            'name' => $defaultCustomer->name,
            'email' => $defaultCustomer->email,
            'phone' => $defaultCustomer->phone,
            'groupName' => $defaultCustomer->customerGroup->name,
            'calculateRate' => $defaultCustomer->customerGroup->calculate_rate,
        ];

        $formateCustomer = $customers->map(function ($customer) {
            return (object) [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'groupName' => $customer->customerGroup->name,
                'calculateRate' => $customer->customerGroup->calculate_rate,
            ];
        });

        return Inertia::render('Sale/Create', [
            'customers' => $formateCustomer,
            'defaultCustomer' => $defaultCustomer,
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
                    $data = [
                        'sale_id' => $sale->id,
                        'product_id' => $saleItem['product_id'],
                        'sale_unit_id' => $saleItem['sale_unit']['id'],
                        'net_unit_price' => $saleItem['original_price'],
                        'calculate_rate' => $customerGroup->calculate_rate,
                        'quantity' => $saleItem['quantity'],
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
                            ProductWarehouse::where([
                                'product_id' => $saleItem['product_id'],
                                'warehouse_id' => $request->warehouse
                            ])->first(),
                            $insertedSaleItem->quantity
                        );

                        // If item has a batch, stock out from batch
                        if ($saleItem['is_batch'] !== 0 && !is_null($saleItem['batch_id'])) {

                            $prefBatch = ProductBatch::find($saleItem['batch_id']);

                            $productWarehouse = ProductWarehouse::where([
                                'product_id' => $saleItem['product_id'],
                                'warehouse_id' => $request->warehouse
                            ])->with([
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

                                foreach ($productWarehouse->batches as $batch) {
                                    if ($requiredRemainQnt > 0) {

                                        $usedQnt = 0;

                                        if ($requiredRemainQnt < $batch->quantity) {

                                            $usedQnt = $batch->quantity - $requiredRemainQnt;
                                            $requiredRemainQnt -= $requiredRemainQnt;

                                        } else {
                                            $usedQnt = $batch->quantity;
                                            $requiredRemainQnt -= $batch->quantity;
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
                                    'quantity' => $prefBatch->quantity + $requiredRemainQnt,
                                ]);

                                $prefBatch->update([
                                    'quantity' => 0 - $requiredRemainQnt
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

        $customers = Customer::with(['customerGroup'])->ofActive(1)->orderBy('name', 'ASC')->get();
        $defaultCustomer = Customer::where('id', Auth::user()->mySetting->default_customer)->with(['customerGroup'])->first();
        $defaultCustomer = [
            'id' => $defaultCustomer->id,
            'name' => $defaultCustomer->name,
            'email' => $defaultCustomer->email,
            'phone' => $defaultCustomer->phone,
            'groupName' => $defaultCustomer->customerGroup->name,
            'calculateRate' => $defaultCustomer->customerGroup->calculate_rate,
        ];

        $formateCustomer = $customers->map(function ($customer) {
            return (object) [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'groupName' => $customer->customerGroup->name,
                'calculateRate' => $customer->customerGroup->calculate_rate,
            ];
        });

        return Inertia::render('Sale/Edit', [
            'customers' => $formateCustomer,
            'defaultCustomer' => $defaultCustomer,
            'warehouseProducts' => StockManager::getAllWarehouseStock(),
            'breadcrumb' => Breadcrumbs::generate('sale.edit',$sale)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $this->authorizeOrFail('sale.edit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $this->authorizeOrFail('sale.delete');
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
}
