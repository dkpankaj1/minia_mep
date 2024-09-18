<?php

namespace App\Http\Controllers\StockReceive;

use App\Enums\ProductionOrderEnum;
use App\Enums\StockReceiveStatusEnum;
use App\Helpers\StockManager;
use App\Http\Controllers\Controller;
use App\Models\ProductBatch;
use App\Models\ProductionOrder;
use App\Models\ProductWarehouse;
use App\Models\StockReceive;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StockReceiveController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('production.stock-received.index');
        $stockReceivedQuery = StockReceive::query()->with(['productionOrder']);
        $limit = $request->query('limit', 10);
        $stockReceivedResources = $stockReceivedQuery->latest()->paginate($limit)->withQueryString();
        $prepStockReceivedDate = $stockReceivedResources->map(function ($stockReceived) {
            return (object) [
                'id' => $stockReceived->id,
                'code' => $stockReceived->code,
                'date' => $stockReceived->date,
                'productionOrder' => (object) [
                    'id' => $stockReceived->productionOrder->id,
                    'code' => $stockReceived->productionOrder->code,
                ],
                'status' => $stockReceived->status
            ];
        });
        dd([
            'stockReceives' => [
                'data' => $prepStockReceivedDate,
                'links' => $stockReceivedResources->linkCollection()->toArray(),
            ]
        ], );
        return Inertia::render('Production/StockReceive/List', [
            'stockReceives' => [
                'data' => $prepStockReceivedDate,
                'links' => $stockReceivedResources->linkCollection()->toArray(),
            ],
            'stockReceiveCount' => $stockReceivedQuery->count(),
            'breadcrumb' => Breadcrumbs::generate('production.stock-received.index')
        ]);
    }
    public function create()
    {
        $this->authorizeOrFail('production.stock-received.create');
        $transformProductionOrders = ProductionOrder::with(['billOfMaterial', 'billOfMaterial.product'])
            ->where('status', ProductionOrderEnum::IN_PROGRESS)->get()->map(function ($productionOrder) {
                return (object) [
                    'id' => $productionOrder->id,
                    'code' => $productionOrder->code,
                    'product' => (object) [
                        'id' => $productionOrder->billOfMaterial->product->id,
                        'name' => $productionOrder->billOfMaterial->product->name,
                        'is_batch' => $productionOrder->billOfMaterial->product->is_batch,
                    ]
                ];
            });
        return Inertia::render('Production/StockReceive/Create', [
            'productionOrders' => $transformProductionOrders,
            "currentData" => Carbon::today()->format('Y-m-d'),
            "nextCode" => $this->generateStockReceivedCode(),
            'breadcrumb' => Breadcrumbs::generate('production.stock-received.create')
        ]);
    }
    public function store(Request $request)
    {
        $this->authorizeOrFail('production.stock-received.create');
        $request->validate([
            'date' => ['required', 'date'],
            "code" => ['required', Rule::unique(StockReceive::class, 'code')],
            "production_order" => ['required', Rule::exists(ProductionOrder::class, 'id')],
            'is_batch' => ['required', 'boolean'],
            'status' => ['required', Rule::in(array_column(StockReceiveStatusEnum::cases(), 'value'))],
            'remark' => ['required'],
            'expiration' => ['required_if:is_batch,1'],
            'batch' => ['required_if:is_batch,1', Rule::unique(ProductBatch::class, 'batch')]
        ], [
            'batch.required_if' => "The batch field is required.",
            'expiration.required_if' => "The expiration field is required."
        ]);
        try {
            $productionOrder = ProductionOrder::with([
                'billOfMaterial.product'
            ])->find($request->production_order);
            $data = [
                "code" => $request->code,
                "date" => $request->date,
                "production_order_id" => $request->production_order,
                "status" => $request->status,
                "remark" => $request->remark,
                "quantity" => $productionOrder->quantity,
                "unit_id" => $productionOrder->billOfMaterial->product->unit_id
            ];
            $statusMap = [
                StockReceiveStatusEnum::COMPLETE->value => ProductionOrderEnum::COMPLETE,
                StockReceiveStatusEnum::REJECT->value => ProductionOrderEnum::REJECT,
            ];
            if (isset($statusMap[$request->status])) {
                $productionOrder->update(['status' => $statusMap[$request->status]]);
            }
            if ($request->status === StockReceiveStatusEnum::COMPLETE->value) {
                $productWarehouse = ProductWarehouse::where([
                    "product_id" => $productionOrder->billOfMaterial->product->id,
                    "warehouse_id" => $productionOrder->warehouse_id
                ])->first();
                if ($productWarehouse) {
                    StockManager::stockIn(
                        $productWarehouse,
                        $productionOrder->quantity
                    );
                    if ($request->is_batch == 1) {
                        $productBatch = ProductBatch::create([
                            "product_warehouse_id" => $productWarehouse->id,
                            "batch" => $request->batch,
                            "expiration" => $request->expiration,
                            "quantity" => $productionOrder->quantity,
                        ]);
                        $data['product_batch_id'] = $productBatch->id;
                    }
                }
            }
            StockReceive::create($data);
            return redirect()->route('production.stock-received.index')->with('success', 'Stock received created');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }

    }
    public function show(StockReceive $stockReceive)
    {
        $this->authorizeOrFail('production.stock-received.index');

        return Inertia::render('Production/StockReceive/Show', [
            'breadcrumb' => Breadcrumbs::generate('production.stock-received.show', $stockReceive)
        ]);

    }
    public function edit(StockReceive $stockReceive)
    {
        $this->authorizeOrFail('production.stock-received.edit');
        $transformProductionOrders = ProductionOrder::with(['billOfMaterial', 'billOfMaterial.product'])
            ->where('id', $stockReceive->id)
            ->get()->map(function ($productionOrder) {
                return (object) [
                    'id' => $productionOrder->id,
                    'code' => $productionOrder->code,
                    'product' => (object) [
                        'id' => $productionOrder->billOfMaterial->product->id,
                        'name' => $productionOrder->billOfMaterial->product->name,
                        'is_batch' => $productionOrder->billOfMaterial->product->is_batch,
                    ]
                ];
            });
        $stockReceiveData = (object) [
            'id' => $stockReceive->id,
            'date' => $stockReceive->date,
            'code' => $stockReceive->code,
            'production_order' => $stockReceive->production_order_id,
            "is_batch" => $stockReceive->productionOrder->billOfMaterial->product->is_batch,
            "batch_id" => $stockReceive->productBatch?->id,
            "batch" => $stockReceive->productBatch?->batch,
            "expiration" => $stockReceive->productBatch?->expiration,
            'status' => $stockReceive->status,
            'remark' => $stockReceive->remark,
        ];
        return Inertia::render('Production/StockReceive/Edit', [
            'stockReceive' => $stockReceiveData,
            'productionOrders' => $transformProductionOrders,
            'breadcrumb' => Breadcrumbs::generate('production.stock-received.edit', $stockReceive)
        ]);
    }
    public function update(Request $request, StockReceive $stockReceive)
    {
        $this->authorizeOrFail('production.stock-received.edit');
        $request->validate([
            'date' => ['required', 'date'],
            "code" => ['required', Rule::unique(StockReceive::class, 'code')],
            "production_order" => ['required', Rule::exists(ProductionOrder::class, 'id')],
            'is_batch' => ['required', 'boolean'],
            'status' => ['required', Rule::in(array_column(StockReceiveStatusEnum::cases(), 'value'))],
            'remark' => ['required'],
            'batch_id' => ['required_if:is_batch,1', Rule::exists(ProductBatch::class, 'id')],
            'batch' => ['required_if:is_batch,1', Rule::unique(ProductBatch::class, 'batch')->ignore($request->batch_id)],
            'expiration' => ['required_if:is_batch,1'],
        ], [
            'batch_id.required_if' => "The batch id field is required.",
            'batch.required_if' => "The batch field is required.",
            'expiration.required_if' => "The expiration field is required."
        ]);

        try {

            $productionOrder = ProductionOrder::with([
                'billOfMaterial.product'
            ])->find($request->production_order);

            // restore old stock
            $productWarehouse = ProductWarehouse::where([
                "product_id" => $productionOrder->billOfMaterial->product->id,
                "warehouse_id" => $productionOrder->warehouse_id
            ])->first();

            if ($stockReceive->status === StockReceiveStatusEnum::COMPLETE) {
                StockManager::stockOut(
                    $productWarehouse,
                    $productionOrder->quantity
                );
                // delete batch
                $stockReceive->productBatch()->delete();
            }

            $data = [
                "code" => $request->code,
                "date" => $request->date,
                "status" => $request->status,
                "remark" => $request->remark,
            ];

            $statusMap = [
                StockReceiveStatusEnum::COMPLETE->value => ProductionOrderEnum::COMPLETE,
                StockReceiveStatusEnum::REJECT->value => ProductionOrderEnum::REJECT,
            ];
            if (isset($statusMap[$request->status])) {
                $productionOrder->update(['status' => $statusMap[$request->status]]);
            }
            if ($request->status === StockReceiveStatusEnum::COMPLETE->value) {
                $productWarehouse = ProductWarehouse::where([
                    "product_id" => $productionOrder->billOfMaterial->product->id,
                    "warehouse_id" => $productionOrder->warehouse_id
                ])->first();
                if ($productWarehouse) {
                    StockManager::stockIn(
                        $productWarehouse,
                        $productionOrder->quantity
                    );
                    if ($request->is_batch == 1) {
                        $productBatch = ProductBatch::create([
                            "product_warehouse_id" => $productWarehouse->id,
                            "batch" => $request->batch,
                            "expiration" => $request->expiration,
                            "quantity" => $productionOrder->quantity,
                        ]);
                        $data['product_batch_id'] = $productBatch->id;
                    }
                }
            }
            $stockReceive->update($data);

            return redirect()->back()->with('success', 'Stock received updated');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }


    }
    public function destroy(StockReceive $stockReceive)
    {
        $this->authorizeOrFail('production.stock-received.delete');

    }
    protected function generateStockReceivedCode()
    {
        $nextId = StockReceive::max('id') ?? 0;
        do {
            $nextId += 1;
            $rcvCode = 'STR' . str_pad($nextId, 6, '0', STR_PAD_LEFT);

        } while (StockReceive::where('code', $rcvCode)->exists());
        return $rcvCode;
    }
}
