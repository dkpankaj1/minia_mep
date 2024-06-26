<?php

namespace App\Http\Controllers\Purchase;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Helpers\StockManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Http\Requests\Purchase\UpdatePurchaseRequest;
use App\Http\Resources\Product\ListProductForPurchaseResource;
use App\Http\Resources\Purchase\EditPurchaseResource;
use App\Http\Resources\Purchase\ListPurchaseResource;
use App\Http\Resources\Purchase\PurchaseResource;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('purchase.index');
        return Inertia::render('Purchase/List', [
            'breadcrumb' => Breadcrumbs::generate('purchase.index'),
            'purchases' => ListPurchaseResource::collection(Purchase::with([
                'financeYear',
                'supplier',
                'user',
                'warehouse',
            ])->latest()->get()),
            'purchaseCount' => Purchase::count(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('purchase.create');

        return Inertia::render('Purchase/Create', [
            'breadcrumb' => Breadcrumbs::generate('purchase.create'),
            'products' => ListProductForPurchaseResource::collection(Product::all()),
            'suppliers' => Supplier::all(),
            'warehouses' => Warehouse::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseRequest $request)
    {
        $this->authorizeOrFail('purchase.create');

        try {
            DB::transaction(function () use ($request) {
                // Calculate grand sub total and grand total
                $grandSubTotal = PurchaseHelper::calculateGrandSubTotal($request->purchase_item, $request->order_tax);
                $grandTotal = PurchaseHelper::grandTotal($request);

                // Prepare purchase meta data
                $purchaseMeta = [
                    'date' => $request->date,
                    'reference' => $request->reference ?? time(),
                    'finance_year_id' => Auth::user()->mySetting->default_finance_year,
                    'supplier_id' => $request->supplier,
                    'warehouse_id' => $request->warehouse,
                    'discount_method' => $request->discount_method,
                    'discount' => $request->discount,
                    'total_tax' => $grandSubTotal * ($request->order_tax / 100),
                    'tax_rate' => $request->order_tax,
                    'total_cost' => $grandSubTotal,
                    'shipping_cost' => $request->shipping_cost,
                    'other_cost' => $request->other_cost,
                    'grand_total' => $grandTotal,
                    'paid_amount' => 0,
                    'order_status' => $request->order_status,
                    'payment_status' => PaymentStatusEnum::PENDING,
                    'note' => $request->note,
                    'user_id' => Auth::user()->id,
                ];

                // Create the purchase
                $purchase = Purchase::create($purchaseMeta);

                // Prepare purchase items data
                $purchaseItemsData = [];
                $currentTime = Carbon::now();

                foreach ($request->purchase_item as $item) {
                    $purchaseItemData = [
                        'purchase_id' => $purchase->id,
                        'product_id' => $item['product_id'],
                        'purchase_unit_id' => $item['purchase_unit_id'],
                        'net_unit_cost' => $item['net_unit_cost'],
                        'quantity' => $item['quantity'],
                        'discount_method' => $item['discount_method'],
                        'discount' => $item['discount'],
                        'tax_method' => $item['tax_method'],
                        'tax_rate' => $item['tax_rate'],
                        'total_tax' => PurchaseHelper::calculateTotalTax($item),
                        'sub_total' => PurchaseHelper::calculateSubTotal($item),
                        'product_batch_id' => null,
                        'created_at' => $currentTime,
                        'updated_at' => $currentTime,
                    ];

                    // Calculate the quantity based on the unit
                    $unit = Unit::find($item['purchase_unit_id']);
                    $quantity = ($unit->operator == '/') ? $item['quantity'] / $unit->operator_value : $item['quantity'] * $unit->operator_value;

                    // Handle batch items
                    if ($item['is_batch'] == 1) {
                        $productBatch = ProductBatch::create([
                            'product_id' => $item['product_id'],
                            'batch' => $item['batch'],
                            'expiration' => $item['expiration'],
                            'quantity' => $quantity,
                            'created_at' => $currentTime,
                            'updated_at' => $currentTime,
                        ]);
                        $purchaseItemData['product_batch_id'] = $productBatch->id;
                    }

                    $purchaseItemsData[] = $purchaseItemData;

                    // Update stock if order status is received
                    if ($request->order_status == OrderStatusEnum::RECEIVED) {
                        StockManager::stockIn($item['product_id'], $request->warehouse, $quantity);
                    }
                }

                // Insert all purchase items
                PurchaseItem::insert($purchaseItemsData);
            }, 10);

            return redirect()->route('purchase.index')->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        $this->authorizeOrFail('purchase.index');
        return Inertia::render('Purchase/Show', [
            'breadcrumb' => Breadcrumbs::generate('purchase.show',$purchase),
            'purchase' => new PurchaseResource($purchase)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        $this->authorizeOrFail('purchase.edit');

        return Inertia::render('Purchase/Edit', [
            'purchase' => new EditPurchaseResource($purchase),
            'breadcrumb' => Breadcrumbs::generate('purchase.edit', $purchase->id),
            'products' => ListProductForPurchaseResource::collection(Product::all()),
            'suppliers' => Supplier::all(),
            'warehouses' => Warehouse::all()
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $this->authorizeOrFail('purchase.update');

        try {
            DB::transaction(function () use ($request, $purchase) {

                // restore product warehouse when item is received
                if ($purchase->order_status == OrderStatusEnum::RECEIVED) {
                    foreach ($purchase->purchaseItems as $purchaseItem) {

                        $quantity = PurchaseHelper::calculateQuantity(
                            $purchaseItem->quantity,
                            Unit::find($purchaseItem->purchase_unit_id)
                        );

                        StockManager::stockOut($purchaseItem->product->id, $purchase->warehouse_id, $quantity);
                    }
                }

                // Calculate grand totals and subtotals
                $grandSubTotal = PurchaseHelper::calculateGrandSubTotal($request->purchase_item, $request->order_tax);
                $grandTotal = PurchaseHelper::grandTotal($request);

                // Update purchase metadata
                $purchase->update([
                    'date' => $request->date,
                    'reference' => $request->reference ?? time(),
                    'supplier_id' => $request->supplier,
                    'warehouse_id' => $request->warehouse,
                    'discount_method' => $request->discount_method,
                    'discount' => $request->discount,
                    'total_tax' => $grandSubTotal * ($request->order_tax / 100),
                    'tax_rate' => $request->order_tax,
                    'total_cost' => $grandSubTotal,
                    'shipping_cost' => $request->shipping_cost,
                    'other_cost' => $request->other_cost,
                    'grand_total' => $grandTotal,
                    'order_status' => $request->order_status,
                    'note' => $request->note,
                    'user_id' => Auth::user()->id,
                ]);

                // Prepare new purchase items and track changes
                $purchaseItemsData = [];
                $currentTime = Carbon::now();

                foreach ($request->purchase_item as $item) {

                    $unit = Unit::find($item['purchase_unit_id']);
                    $quantity = PurchaseHelper::calculateQuantity($item['quantity'], $unit);

                    $purchaseItemData = [
                        'purchase_id' => $purchase->id,
                        'product_id' => $item['product_id'],
                        'purchase_unit_id' => $item['purchase_unit_id'],
                        'net_unit_cost' => $item['net_unit_cost'],
                        'quantity' => $item['quantity'],
                        'discount_method' => $item['discount_method'],
                        'discount' => $item['discount'],
                        'tax_method' => $item['tax_method'],
                        'tax_rate' => $item['tax_rate'],
                        'total_tax' => PurchaseHelper::calculateTotalTax($item),
                        'sub_total' => PurchaseHelper::calculateSubTotal($item),
                        'product_batch_id' => null,
                        'created_at' => $currentTime,
                        'updated_at' => $currentTime,
                    ];

                    if ($item['is_batch'] == 1) {

                        $batch = $item['batch'];
                        $expiration = $item['expiration'];
                        $existingPurchaseItem = PurchaseItem::where('purchase_id', $purchase->id)->where('product_id', $item['product_id'])->first();

                        if ($existingPurchaseItem && $existingPurchaseItem->product_batch_id) {

                            $existingPurchaseItemQuantity = PurchaseHelper::calculateQuantity(
                                $existingPurchaseItem->quantity,
                                Unit::find($existingPurchaseItem->purchase_unit_id)
                            );

                            $quantityDiff = $existingPurchaseItemQuantity - $existingPurchaseItem->batch->quantity;

                            $productBatch = ProductBatch::create([
                                'product_id' => $item['product_id'],
                                'batch' => $batch,
                                'expiration' => $expiration,
                                'quantity' => $quantity - $quantityDiff,
                                'created_at' => $currentTime,
                                'updated_at' => $currentTime,
                            ]);

                        } else {
                            $productBatch = ProductBatch::create([
                                'product_id' => $item['product_id'],
                                'batch' => $batch,
                                'expiration' => $expiration,
                                'quantity' => $quantity,
                                'created_at' => $currentTime,
                                'updated_at' => $currentTime,
                            ]);
                        }

                        $purchaseItemData['product_batch_id'] = $productBatch->id;
                    }

                    $purchaseItemsData[] = $purchaseItemData;

                    if ($request->order_status == OrderStatusEnum::RECEIVED) {
                        StockManager::stockIn($item['product_id'], $request->warehouse, $quantity);
                    }
                }

                foreach ($purchase->purchaseItems as $existingItem) {
                    if ($existingItem->product_batch_id) {
                        ProductBatch::find($existingItem->product_batch_id)->delete();
                    }
                    $existingItem->delete();
                }

                PurchaseItem::insert($purchaseItemsData);

            }, 10);

            return redirect()->route('purchase.index')->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $this->authorizeOrFail('purchase.delete');

        try {
            DB::transaction(function () use ($purchase) {


                if ($purchase->order_status == OrderStatusEnum::RECEIVED) {

                    foreach ($purchase->purchaseItems as $purchaseItem) {
                        $quantity = PurchaseHelper::calculateQuantity(
                            $purchaseItem->quantity,
                            Unit::find($purchaseItem->purchase_unit_id)
                        );
                        StockManager::stockOut($purchaseItem->product->id, $purchase->warehouse_id, $quantity);
                    }
                }

                foreach ($purchase->purchaseItems as $existingItem) {
                    if ($existingItem->product_batch_id) {
                        ProductBatch::find($existingItem->product_batch_id)->delete();
                    }
                    $existingItem->delete();
                }

                $purchase->delete();

            }, 10);

            return redirect()->route('purchase.index')->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }

    }
}
