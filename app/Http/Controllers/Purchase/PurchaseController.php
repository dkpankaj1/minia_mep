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
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('purchase.index');
        $purchaseQuery = Purchase::query();
        $limit = $request->query('limit',10);
        // Filter by reference
        if ($reference = $request->query('reference')) {
            $purchaseQuery->where('reference', $reference);
        }
        // Filter by date
        if ($date = $request->query('date')) {
            $purchaseQuery->where('date', $date);
        }
        // Filter by customer ID
        if ($supplierID = $request->query('supplier')) {
            $purchaseQuery->whereHas('supplier', function ($query) use ($supplierID) {
                $query->where('id', $supplierID);
            });
        }
        // Filter by orderStatus
        if ($orderStatus = $request->query('order_status')) {
            $purchaseQuery->where('order_status', $orderStatus);
        }
        // Filter by paymentStatus
        if ($paymentStatus = $request->query('payment_status')) {
            $purchaseQuery->where('payment_status', $paymentStatus);
        }
        $purchases = $purchaseQuery->with([
            'financeYear',
            'supplier',
            'user',
            'warehouse',
        ])->latest()->paginate($limit)->withQueryString();
        $formattedPurchaseData = $purchases->map(function ($purchase) {
            return [
                'id' => $purchase->id,
                'date' => $purchase->date,
                'reference' => $purchase->reference,
                'finance_year' => $purchase->financeYear->name,
                'supplier' => $purchase->supplier->name,
                'warehouse' => $purchase->warehouse->name,
                'grand_total' => $purchase->grand_total,
                'paid_amount' => $purchase->paid_amount,
                'status' => $purchase->order_status,
                'payment_status' => $purchase->payment_status,
                'user' => $purchase->user->name,
            ];
        });
        $suppliers = Supplier::select(['id', 'name', 'email'])->get();
        return Inertia::render('Purchase/List', [
            'breadcrumb' => Breadcrumbs::generate('purchase.index'),
            'purchases' => [
                'data' => $formattedPurchaseData,
                'links' => $purchases->linkCollection()->toArray(),
            ],
            'purchaseCount' => Purchase::count(),
            'suppliers' => $suppliers,
            'queryParam' => request()->query(),
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
            'products' => ListProductForPurchaseResource::collection(Product::active()->get()),
            'suppliers' => Supplier::all(),
            'warehouses' => Warehouse::active()->get(),
            'referenceNo' => $this->generateReferenceNo()
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
                $grandSubTotal = PurchaseHelper::calculateGrandSubTotal($request->purchase_item);
                $grandTotal = PurchaseHelper::grandTotal(
                    $request->purchase_item,
                    $request->discount,
                    $request->discount_method,
                    $request->other_cost,
                    $request->shipping_cost,
                    $request->order_tax
                );

                // Prepare purchase meta data
                $purchaseMeta = [
                    'date' => $request->date,
                    'reference' => $request->reference ?? time(),
                    'finance_year_id' => Auth::user()->mySetting->default_finance_year,
                    'supplier_id' => $request->supplier,
                    'warehouse_id' => $request->warehouse,
                    'discount_method' => $request->discount_method,
                    'discount' => $request->discount,
                    'total_tax' => PurchaseHelper::totalTax(
                        $request->purchase_item,
                        $request->discount,
                        $request->discount_method,
                        $request->order_tax
                    ),
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
                        'total_tax' => PurchaseHelper::calculateItemTotalTax($item),
                        'sub_total' => PurchaseHelper::calculateItemSubTotal($item),
                        'product_batch_id' => null,
                        'created_at' => $currentTime,
                        'updated_at' => $currentTime,
                    ];

                    // Calculate the quantity based on the unit
                    $unit = Unit::find($item['purchase_unit_id']);
                    $quantity = ($unit->operator == '/') ? $item['quantity'] / $unit->operator_value : $item['quantity'] * $unit->operator_value;
                    $productWarehouse = StockManager::getProductWarehouse($item['product_id'], $request->warehouse);

                    // Handle batch items
                    if ($item['is_batch'] == 1) {
                        $productBatch = ProductBatch::create([
                            'product_warehouse_id' => $productWarehouse->id,
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
                        StockManager::stockIn($productWarehouse, $quantity);
                    }
                }

                // Insert all purchase items
                PurchaseItem::insert($purchaseItemsData);
                Log::channel('custom')->info("Purchase created", ['ID' => $purchase->id, 'user' => Auth::user()->email]);
            }, 10);

            return redirect()->route('purchase.index')->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            Log::channel('custom')->error("Failed to create purchase", ['error' => $e->getMessage()]);
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
            'breadcrumb' => Breadcrumbs::generate('purchase.show', $purchase),
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
            'products' => ListProductForPurchaseResource::collection(Product::active()->get()),
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

                        StockManager::stockOut(
                            StockManager::getProductWarehouse($purchaseItem->product->id, $purchase->warehouse_id),
                            $quantity
                        );
                    }
                }

                // Calculate grand totals and subtotals
                $grandSubTotal = PurchaseHelper::calculateGrandSubTotal($request->purchase_item);
                $grandTotal = PurchaseHelper::grandTotal(
                    $request->purchase_item,
                    $request->discount,
                    $request->discount_method,
                    $request->other_cost,
                    $request->shipping_cost,
                    $request->order_tax
                );

                // Update purchase metadata
                $purchase->update([
                    'date' => $request->date,
                    'reference' => $request->reference ?? time(),
                    'supplier_id' => $request->supplier,
                    'warehouse_id' => $request->warehouse,
                    'discount_method' => $request->discount_method,
                    'discount' => $request->discount,
                    'total_tax' => PurchaseHelper::totalTax(
                        $request->purchase_item,
                        $request->discount,
                        $request->discount_method,
                        $request->order_tax
                    ),
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
                        'total_tax' => PurchaseHelper::calculateItemTotalTax($item),
                        'sub_total' => PurchaseHelper::calculateItemSubTotal($item),
                        'product_batch_id' => null,
                        'created_at' => $currentTime,
                        'updated_at' => $currentTime,
                    ];

                    if ($item['is_batch'] == 1) {

                        $batch = $item['batch'];
                        $expiration = $item['expiration'];
                        $existingPurchaseItem = PurchaseItem::where('purchase_id', $purchase->id)->where('product_id', $item['product_id'])->first();
                        $productWarehouse = StockManager::getProductWarehouse($item['product_id'], $request->warehouse);

                        if ($existingPurchaseItem && $existingPurchaseItem->product_batch_id) {

                            $existingPurchaseItemQuantity = PurchaseHelper::calculateQuantity(
                                $existingPurchaseItem->quantity,
                                Unit::find($existingPurchaseItem->purchase_unit_id)
                            );

                            $quantityDiff = $existingPurchaseItemQuantity - $existingPurchaseItem->batch->quantity;

                            $productBatch = ProductBatch::create([
                                'product_warehouse_id' => $productWarehouse->id,
                                'batch' => $batch,
                                'expiration' => $expiration,
                                'quantity' => $quantity - $quantityDiff,
                                'created_at' => $currentTime,
                                'updated_at' => $currentTime,
                            ]);

                        } else {
                            $productBatch = ProductBatch::create([
                                'product_warehouse_id' => $productWarehouse->id,
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
                        StockManager::stockIn(StockManager::getProductWarehouse($item['product_id'], $request->warehouse), $quantity);
                    }
                }

                foreach ($purchase->purchaseItems as $existingItem) {
                    if ($existingItem->product_batch_id) {
                        ProductBatch::find($existingItem->product_batch_id)->delete();
                    }
                    $existingItem->delete();
                }

                PurchaseItem::insert($purchaseItemsData);

                Log::channel('custom')->info("Purchase updated", ['ID' => $purchase->id, 'user' => Auth::user()->email]);

            }, 10);

            return redirect()->route('purchase.index')->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            Log::channel('custom')->error("Failed to update purchase", ['ID' => $purchase->id, 'error' => $e->getMessage()]);
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

                        StockManager::stockOut(
                            StockManager::getProductWarehouse($purchaseItem->product->id, $purchase->warehouse_id),
                            $quantity
                        );
                    }
                }

                foreach ($purchase->purchaseItems as $existingItem) {
                    if ($existingItem->product_batch_id) {
                        ProductBatch::find($existingItem->product_batch_id)->delete();
                    }
                    $existingItem->delete();
                }

                $purchase->delete();

                Log::channel('custom')->info("Purchase deleted", ['ID' => $purchase->id, 'user' => Auth::user()->email]);

            }, 10);

            return redirect()->route('purchase.index')->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            Log::channel('custom')->error("Failed to delete purchase", ['ID' => $purchase->id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('danger', $e->getMessage());
        }

    }

    protected function generateReferenceNo()
    {
        $nextId = Purchase::max('id') ?? 0;
        do {
            $nextId += 1;
            $referenceNo = 'REF_' . str_pad($nextId, 8, '0', STR_PAD_LEFT);

        } while (Purchase::where('reference', $referenceNo)->exists());
        return $referenceNo;
    }

}
