<?php

namespace App\Http\Controllers\StockIssue;

use App\Enums\ProductionOrderEnum;
use App\Enums\StockIssueStatusEnum;
use App\Helpers\StockManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\StockIssue\StoreStockIssueRequest;
use App\Http\Requests\StockIssue\UpdateStockIssueRequest;
use App\Models\ProductBatch;
use App\Models\ProductionOrder;
use App\Models\ProductWarehouse;
use App\Models\StockIssue;
use App\Models\StockIssueItem;
use App\Models\StockIssueItemBatch;
use App\Models\Unit;
use App\Traits\AuthorizationFilter;
use Carbon\Carbon;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockIssueController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('production.stock-issue.index');

        $limit = $request->query('limit', 10);
        $stockIssueQuery = StockIssue::query()->with([
            'productionOrder',
            'user'

        ]);

        $stockIssues = $stockIssueQuery->latest()->paginate($limit)->withQueryString();

        $stockIssuesData = $stockIssues->map(function ($stockIssue) {
            return (object) [
                'id' => $stockIssue->id,
                'code' => $stockIssue->code,
                'date' => $stockIssue->date,
                'productionOrder' => $stockIssue->productionOrder->code,
                'statue' => $stockIssue->status,
                'user' => $stockIssue->user->name,
            ];
        });

        return Inertia::render('Production/StockIssue/List', [
            'stockIssues' => [
                'data' => $stockIssuesData,
                'links' => $stockIssues->linkCollection()->toArray()
            ],
            'breadcrumb' => Breadcrumbs::generate('production.stock-issue.index'),
        ]);
    }
    public function create(Request $request)
    {
        $this->authorizeOrFail('production.stock-issue.create');

        // Fetch production orders with relations
        $productionOrders = ProductionOrder::with([
            'billOfMaterial',
            'billOfMaterial.materials',
            'billOfMaterial.materials.product',
            'billOfMaterial.materials.product.productWarehouses',
            'billOfMaterial.materials.product.productWarehouses.batches' => function ($query) {
                $query->withPositiveQuantity()->NotExpired();
            },
        ])
            ->where('status', ProductionOrderEnum::PLANNED)
            ->get();

        // Map production orders to required format
        $mappedProductionOrders = $productionOrders->map(function ($productionOrder) {
            // Extract Bill of Material details
            $billOfMaterial = $productionOrder->billOfMaterial;
            $product = $billOfMaterial->product;

            // Map materials for the production order
            $mappedMaterials = $billOfMaterial->materials->map(function ($material) use ($productionOrder) {
                $materialUnit = $material->unit;

                // Fetch or create product warehouse
                $productWarehouse = ProductWarehouse::firstOrCreate([
                    "product_id" => $material->product->id,
                    "warehouse_id" => $productionOrder->warehouse_id,
                ], ['quantity' => 0]);

                $productWarehouseQuantity = $material->product->is_batch
                    ? $productWarehouse->batches()->withPositiveQuantity()
                        ->notExpired()->sum("quantity")
                    : $productWarehouse->quantity;

                // Calculate available quantity and total unit cost
                $availableQuantity = $materialUnit->operator === "*"
                    ? $productWarehouseQuantity / $materialUnit->operator_value
                    : $productWarehouseQuantity * $materialUnit->operator_value;

                $unitCost = $materialUnit->operator === "*"
                    ? $material->product->cost
                    : $material->product->cost / $materialUnit->operator_value;

                $totalUnitCost = ($unitCost * $material->quantity) * $productionOrder->quantity;

                // Return mapped material object
                return (object) [
                    'productWarehouse_id' => $productWarehouse->id,
                    'product' => (object) [
                        'id' => $material->product->id,
                        'name' => $material->product->name,
                        'code' => $material->product->code,
                        'is_batch' => $material->product->is_batch
                    ],
                    'reqQuantity' => $material->quantity * $productionOrder->quantity,
                    'avlQuantity' => $availableQuantity,
                    'unit' => $materialUnit,
                    'totalUnitCost' => $totalUnitCost,
                    'productBatches' => $productWarehouse->batches()
                        ->withPositiveQuantity()
                        ->notExpired()
                        ->get(),
                ];
            });

            // Return mapped production order object
            return (object) [
                'id' => $productionOrder->id,
                'date' => $productionOrder->date,
                'code' => $productionOrder->code,
                'bom' => (object) [
                    'id' => $billOfMaterial->id,
                    'code' => $billOfMaterial->code,
                    'overhead_cost' => $billOfMaterial->overhead_cost,
                    'other_cost' => $billOfMaterial->other_cost
                ],
                'product' => $product->name ?? null,
                'unit' => $product->unit ?? null,
                'quantity' => $productionOrder->quantity,
                'materials' => $mappedMaterials,
            ];
        });

        // Render the view with data
        return Inertia::render('Production/StockIssue/Create', [
            'productionOrders' => $mappedProductionOrders,
            'currentData' => Carbon::today()->format('Y-m-d'),
            'stockIssueCode' => $this->generateStockIssueCode(),
            'breadcrumb' => Breadcrumbs::generate('production.stock-issue.create'),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockIssueRequest $request)
    {
        $this->authorizeOrFail('production.stock-issue.create');

        try {
            DB::transaction(function () use ($request) {
                // create stockIssue
                $stockIssueData = [
                    "code" => $request->code,
                    "date" => $request->date,
                    "production_order_id" => $request->production_order,
                    "status" => $request->status,
                    "user_id" => $request->user()->id,
                ];
                $stockIssue = StockIssue::create($stockIssueData);
                foreach ($request->items as $item) {
                    $itemUnit = Unit::find($item['unit']['id']);
                    $requiredQuantity = $itemUnit->operator == "/"
                        ? $item['reqQuantity'] / $itemUnit->operator_value
                        : $item['reqQuantity'] * $itemUnit->operator_value;
                    ;
                    $stockIssueItemData = [
                        "stock_issue_id" => $stockIssue->id,
                        "product_warehouse_id" => $item['productWarehouse_id'],
                        "unit_id" => $item['unit']['id'],
                        "quantity" => $item['reqQuantity'],
                    ];
                    if ($item['is_batch'] !== 0 && !is_null($item['batch'])) {
                        $stockIssueItemData['batch'] = $item['batch'];
                    }
                    $insertedStockIssueItem = StockIssueItem::create($stockIssueItemData);

                    ProductionOrder::find($request->production_order)->update([
                        'status' => ProductionOrderEnum::PROCESSING
                    ]);

                    if ($request->status === StockIssueStatusEnum::COMPLETE->value) {
                        $productWarehouse = ProductWarehouse::with([
                            'batches' => function ($query) {
                                $query->where('quantity', '>', 0)->orderBy('expiration', 'ASC');
                            }
                        ])->find($item['productWarehouse_id']);
                        // Stock out from productWarehouse
                        StockManager::stockOut(
                            $productWarehouse,
                            $requiredQuantity
                        );
                        // If item has a batch, stock out from batch
                        if ($item['is_batch'] !== 0) {
                            $batchQuery = $productWarehouse->batches()
                                ->withPositiveQuantity()
                                ->notExpired();
                            // Fetch preferred batch
                            $prefBatch = !is_null($item['batch'])
                                ? $batchQuery->where('id', $item['batch'])->first()
                                : $batchQuery->first();
                            if ($prefBatch) {
                                $batches = $batchQuery->where('id', '!=', optional($prefBatch)->id)->get();
                                $requiredRemainQnt = $requiredQuantity > $prefBatch->quantity
                                    ? $requiredQuantity - $prefBatch->quantity
                                    : 0;
                                if ($requiredRemainQnt > 0) {
                                    $rQuantity = $requiredQuantity - $prefBatch->quantity;
                                    foreach ($batches as $batch) {
                                        if ($rQuantity > 0) {
                                            $usedQnt = 0;
                                            if ($rQuantity < $batch->quantity) {
                                                $usedQnt = $rQuantity;
                                                $rQuantity = 0;
                                            } else {
                                                $usedQnt = $batch->quantity;
                                                $rQuantity -= $batch->quantity;
                                            }
                                            StockIssueItemBatch::create([
                                                "stock_issue_item_id" => $insertedStockIssueItem->id,
                                                'product_batch_id' => $batch->id,
                                                'quantity' => $usedQnt,
                                            ]);
                                            $batch->update([
                                                'quantity' => $batch->quantity - $usedQnt
                                            ]);
                                        }
                                    }
                                    StockIssueItemBatch::create([
                                        "stock_issue_item_id" => $insertedStockIssueItem->id,
                                        'product_batch_id' => $prefBatch->id,
                                        'quantity' => $prefBatch->quantity + $rQuantity,
                                    ]);
                                    //if rQuantity is  > available quantity then update prefer batch to minus
                                    $prefBatch->update([
                                        'quantity' => 0 - $rQuantity
                                    ]);
                                } else {
                                    StockIssueItemBatch::create([
                                        "stock_issue_item_id" => $insertedStockIssueItem->id,
                                        'product_batch_id' => $prefBatch->id,
                                        'quantity' => $requiredQuantity,
                                    ]);
                                    $prefBatch->update([
                                        'quantity' => $prefBatch->quantity - $requiredQuantity
                                    ]);
                                }
                            }

                            $insertedStockIssueItem->update(['batch' => $prefBatch->id]);
                        }
                    }
                }

            }, 10);

            return redirect()->route('production.stock-issue.index')->with('success', 'Stock Issue created');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(StockIssue $stock_issue)
    {
        $this->authorizeOrFail('production.stock-issue.index');
        return Inertia::render('Production/StockIssue/Show', [
            'breadcrumb' => Breadcrumbs::generate('production.stock-issue.show', $stock_issue),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockIssue $stock_issue)
    {
        $this->authorizeOrFail('production.stock-issue.edit');

        // Fetch production orders with relations
        $stockIssue = $stock_issue->load([
            'productionOrder',
            'productionOrder.BillOfMaterial',
            'productionOrder.BillOfMaterial.product',
            'productionOrder.BillOfMaterial.product.unit',
            'stockIssueItems',
            'stockIssueItems.stockIssueItemBatches',
            'stockIssueItems.unit',
        ]);


        $items = $stockIssue->stockIssueItems->map(function ($item) use ($stockIssue) {
            $productWarehouse = ProductWarehouse::with([
                "batches" => function ($query) use ($item) {
                    $query->notExpired()
                        ->orWhere('id', $item->batch);
                },
                "product"
            ])->find($item->product_warehouse_id);

            $availableQuantity = $item->unit === "*"
                ? $productWarehouse->quantity / $item->unit->operator_value
                : $productWarehouse->quantity * $item->unit->operator_value;

            $quantityWithUsed = $stockIssue->status === StockIssueStatusEnum::COMPLETE
                ? $availableQuantity + $item->quantity
                : $availableQuantity;

            $unitCost = $item->unit->operator === "*"
                ? $productWarehouse->product->cost
                : $productWarehouse->product->cost / $item->unit->operator_value;

            $totalUnitCost = $unitCost * $item->quantity;

            return [
                "productWarehouse_id" => $productWarehouse->id,
                "product" => $productWarehouse->product->name,
                "unit" => $item->unit,
                "reqQuantity" => $item->quantity,
                "avlQuantity" => $quantityWithUsed,
                "totalUnitCost" => $totalUnitCost,
                "batch" => $item->batch,
                "is_batch" => $productWarehouse->product->is_batch,
                "productBatches" => $productWarehouse->batches,
            ];
        });

        $stockIssueData = [
            'id' => $stockIssue->id,
            "code" => $stockIssue->code,
            "production_order" => [
                'id' => $stockIssue->productionOrder->id,
                'code' => $stockIssue->productionOrder->code,
                'product' => $stockIssue->productionOrder->billOfMaterial->product->name,
                'unitShortName' => $stockIssue->productionOrder->billOfMaterial->product->unit->short_name,
                'quantity' => $stockIssue->productionOrder->quantity
            ],
            'other_cost' => $stockIssue->productionOrder->billOfMaterial->other_cost,
            'overhead_cost' => $stockIssue->productionOrder->billOfMaterial->overhead_cost,
            "date" => $stockIssue->date,
            "status" => $stockIssue->status,
            'items' => $items,
        ];


        return Inertia::render('Production/StockIssue/Edit', [
            'stockIssueData' => $stockIssueData,
            'currentData' => Carbon::today()->format('Y-m-d'),
            'stockIssueCode' => $this->generateStockIssueCode(),
            'breadcrumb' => Breadcrumbs::generate('production.stock-issue.edit', $stock_issue),
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockIssueRequest $request, StockIssue $stock_issue)
    {
        $this->authorizeOrFail('production.stock-issue.edit');

        try {

            DB::transaction(function () use ($request, $stock_issue) {

                // Restore stock and batch then delete old entries
                if ($stock_issue->status === StockIssueStatusEnum::COMPLETE) {
                    foreach ($stock_issue->stockIssueItems as $stockIssueItem) {
                        $itemUnit = Unit::find($stockIssueItem->unit_id);
                        $restoredQuantity = $itemUnit->operator === "/"
                            ? $stockIssueItem->quantity / $itemUnit->operator_value
                            : $stockIssueItem->quantity * $itemUnit->operator_value;

                        // Restore product warehouse stock
                        $productWarehouse = ProductWarehouse::find($stockIssueItem->product_warehouse_id);
                        $productWarehouse->increment('quantity', $restoredQuantity);

                        // Restore batch quantities
                        foreach ($stockIssueItem->stockIssueItemBatches as $stockIssueItemBatch) {
                            $batch = ProductBatch::find($stockIssueItemBatch->product_batch_id);
                            $batch->increment('quantity', $stockIssueItemBatch->quantity);
                        }
                    }
                }
                // Delete StockIssueItems and StockIssueItemBatches
                foreach ($stock_issue->stockIssueItems as $stockIssueItem) {
                    $stockIssueItem->stockIssueItemBatches()->delete();
                    $stockIssueItem->delete();
                }
                // update stockIssue
                $stock_issue->update([
                    "code" => $request->code,
                    "date" => $request->date,
                    "production_order_id" => $request->production_order,
                    "status" => $request->status,
                    "user_id" => $request->user()->id,
                ]);
                foreach ($request->items as $item) {
                    $itemUnit = Unit::find($item['unit']['id']);
                    $requiredQuantity = $itemUnit->operator == "/"
                        ? $item['reqQuantity'] / $itemUnit->operator_value
                        : $item['reqQuantity'] * $itemUnit->operator_value;
                    ;
                    $stockIssueItemData = [
                        "stock_issue_id" => $stock_issue->id,
                        "product_warehouse_id" => $item['productWarehouse_id'],
                        "unit_id" => $item['unit']['id'],
                        "quantity" => $item['reqQuantity'],
                    ];
                    if ($item['is_batch'] !== 0 && !is_null($item['batch'])) {
                        $stockIssueItemData['batch'] = $item['batch'];
                    }
                    $insertedStockIssueItem = StockIssueItem::create($stockIssueItemData);

                    ProductionOrder::find($request->production_order)->update([
                        'status' => ProductionOrderEnum::PROCESSING
                    ]);

                    if ($request->status === StockIssueStatusEnum::COMPLETE->value) {
                        $productWarehouse = ProductWarehouse::with([
                            'batches' => function ($query) {
                                $query->where('quantity', '>', 0)->orderBy('expiration', 'ASC');
                            }
                        ])->find($item['productWarehouse_id']);
                        // Stock out from productWarehouse
                        StockManager::stockOut(
                            $productWarehouse,
                            $requiredQuantity
                        );
                        // If item has a batch, stock out from batch
                        if ($item['is_batch'] !== 0) {
                            $batchQuery = $productWarehouse->batches()
                                ->withPositiveQuantity()
                                ->notExpired();
                            // Fetch preferred batch
                            $prefBatch = !is_null($item['batch'])
                                ? $batchQuery->where('id', $item['batch'])->first()
                                : $batchQuery->first();
                            if ($prefBatch) {
                                $batches = $batchQuery->where('id', '!=', optional($prefBatch)->id)->get();
                                $requiredRemainQnt = $requiredQuantity > $prefBatch->quantity
                                    ? $requiredQuantity - $prefBatch->quantity
                                    : 0;
                                if ($requiredRemainQnt > 0) {
                                    $rQuantity = $requiredQuantity - $prefBatch->quantity;
                                    foreach ($batches as $batch) {
                                        if ($rQuantity > 0) {
                                            $usedQnt = 0;
                                            if ($rQuantity < $batch->quantity) {
                                                $usedQnt = $rQuantity;
                                                $rQuantity = 0;
                                            } else {
                                                $usedQnt = $batch->quantity;
                                                $rQuantity -= $batch->quantity;
                                            }
                                            StockIssueItemBatch::create([
                                                "stock_issue_item_id" => $insertedStockIssueItem->id,
                                                'product_batch_id' => $batch->id,
                                                'quantity' => $usedQnt,
                                            ]);
                                            $batch->update([
                                                'quantity' => $batch->quantity - $usedQnt
                                            ]);
                                        }
                                    }
                                    StockIssueItemBatch::create([
                                        "stock_issue_item_id" => $insertedStockIssueItem->id,
                                        'product_batch_id' => $prefBatch->id,
                                        'quantity' => $prefBatch->quantity + $rQuantity,
                                    ]);
                                    //if rQuantity is  > available quantity then update prefer batch to minus
                                    $prefBatch->update([
                                        'quantity' => 0 - $rQuantity
                                    ]);
                                } else {
                                    StockIssueItemBatch::create([
                                        "stock_issue_item_id" => $insertedStockIssueItem->id,
                                        'product_batch_id' => $prefBatch->id,
                                        'quantity' => $requiredQuantity,
                                    ]);
                                    $prefBatch->update([
                                        'quantity' => $prefBatch->quantity - $requiredQuantity
                                    ]);
                                }
                            }

                            $insertedStockIssueItem->update(['batch' => $prefBatch->id]);
                        }
                    }
                }
            }, 10);

            return redirect()->route('production.stock-issue.index')->with('success', 'Stock Issue created');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockIssue $stock_issue)
    {
        $this->authorizeOrFail('production.stock-issue.delete');
        try {
            if ($stock_issue->status === StockIssueStatusEnum::COMPLETE) {
                return redirect()->back()->with('danger', "Stock Issue cannot be deleted.");
            }
            DB::transaction(function () use ($stock_issue) {
                $stock_issue->productionOrder()->update([
                    'status' => ProductionOrderEnum::PLANNED
                ]);
                $stock_issue->stockIssueItems()->delete();
                $stock_issue->delete();
            }, 10);
            return redirect()->back()->with('success', 'Stock Issue deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }

    }

    protected function generateStockIssueCode()
    {
        $nextId = StockIssue::max('id') ?? 0;
        do {
            $nextId += 1;
            $issueCode = 'STI' . str_pad($nextId, 6, '0', STR_PAD_LEFT);

        } while (StockIssue::where('code', $issueCode)->exists());
        return $issueCode;
    }
}
