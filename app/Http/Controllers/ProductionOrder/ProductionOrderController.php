<?php

namespace App\Http\Controllers\ProductionOrder;

use App\Enums\ProductionOrderEnum;
use App\Filters\ProductionOrderFIlter;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductionOrder\ProductionOrderResource;
use App\Models\BillOfMaterial;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\Warehouse;
use App\Models\WorkStation;
use App\Traits\AuthorizationFilter;
use Auth;
use Carbon\Carbon;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductionOrderController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ProductionOrderFIlter $filter)
    {
        $this->authorizeOrFail('production.production-order.index');

        $productionOrdersQuery = ProductionOrder::query()->with([
            "billOfMaterial",
            "financeYear",
            "user",
            "warehouse",
            "workstation",
        ]);

        if ($date = $request->query('date')) {
            $filter->filterByDate($productionOrdersQuery, $date);
        }
        if ($bom = $request->query('bom')) {
            $filter->filterByBom($productionOrdersQuery, $bom);
        }
        if ($status = $request->query('status')) {
            $filter->filterByStatus($productionOrdersQuery, $status);
        }

        if ($product = $request->query('product')) {
            $filter->filterByProduct($productionOrdersQuery, $product);
        }
        if ($workstation = $request->query('workstation')) {
            $filter->filterByWorkStation($productionOrdersQuery, $workstation);
        }

        $limit = $request->query('limit', 10);
        $productionOrders = $productionOrdersQuery->latest()->paginate($limit)->withQueryString();
        $ProductionOrdersResource = $productionOrders->map(function ($productionOrder) {
            return (object) [
                'id' => $productionOrder->id,
                'date' => $productionOrder->date,
                "bom_id" => $productionOrder->billOfMaterial->id,
                "bom_code" => $productionOrder->billOfMaterial->code,
                "product" => $productionOrder->billOfMaterial->product->name,
                "finance_year" => $productionOrder->financeYear->name,
                "warehouse" => $productionOrder->warehouse->name,
                "work_station" => $productionOrder->workStation->name,
                "quantity" => $productionOrder->quantity,
                "unit" => $productionOrder->billOfMaterial->product->unit->short_name,
                "estimated_cost" => $productionOrder->cost,
                "other_cost" => $productionOrder->other_cost,
                "start_at" => $productionOrder->start_at,
                "end_at" => $productionOrder->end_at,
                "status" => $productionOrder->status,
                "user_id" => $productionOrder->user->name,
            ];
        });
        return Inertia::render('Production/ProductionPlan/List', [
            'productionOrders' => [
                "data" => $ProductionOrdersResource,
                "links" => $productionOrders->linkCollection()->toArray()
            ],
            'countProductionOrder' => ProductionOrder::count(),
            'queryParam' => $request->query(),
            'products' => Product::active()->where('category_id', 1)->select(['id', 'code', 'name'])->get(),
            'workstations' => WorkStation::active()->select(['id', 'name', 'status'])->get(),
            'breadcrumb' => Breadcrumbs::generate('production.production-order.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('production.production-order.create');

        $BOMs = BillOfMaterial::active()->with(['product', 'materials'])->get();

        $BOMs = $BOMs->map(function ($bom) {
            return (object) [
                'id' => $bom->id,
                'code' => $bom->code,
                'product' => $bom->product->name,
                'total' => $bom->materials->reduce(function ($acc, $material) {
                    $unitCost = $material->unit->operator === "*"
                        ? $material->product->cost
                        : $material->product->cost / $material->unit->operator_value;

                    return $acc + ($material->quantity * $unitCost);
                }, 0),
                'overhead_cost' => $bom->overhead_cost,
                'other_cost' => $bom->other_cost,
            ];
        });
        $workStations = WorkStation::active()->select(['id', 'name'])->get();
        $warehouses = Warehouse::active()->select(['id', 'name'])->get();

        return Inertia::render('Production/ProductionPlan/Create', [
            'BOMs' => $BOMs,
            'workStations' => $workStations,
            'warehouses' => $warehouses,
            'currentData' => Carbon::today()->format('Y-m-d'),
            'breadcrumb' => Breadcrumbs::generate('production.production-order.create')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorizeOrFail('production.production-order.create');
        $request->validate([
            "date" => ["required"],
            "bill_of_material" => ["required", Rule::exists(BillOfMaterial::class, 'id')],
            "warehouse" => ["required", Rule::exists(Warehouse::class, 'id')],
            "work_station" => ["required", Rule::exists(WorkStation::class, 'id')],
            "quantity" => ["required"],
            "cost" => ['required'],
            "other_cost" => ['required'],
            "start_at" => ["required"],
            "end_at" => ["required"],
        ]);
        try {

            ProductionOrder::create([
                "date" => $request->date,
                "bill_of_material_id" => $request->bill_of_material,
                "finance_year_id" => Auth::user()->mySetting->default_finance_year,
                "warehouse_id" => $request->warehouse,
                "work_station_id" => $request->work_station,
                "quantity" => $request->quantity,
                "cost" => $request->cost,
                "other_cost" => $request->other_cost,
                "start_at" => $request->start_at,
                "end_at" => $request->end_at,
                "status" => ProductionOrderEnum::PLANNED,
                "user_id" => Auth::user()->id,
            ]);

            return redirect()->route('production.production-order.index')->with('success', 'Production order created');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductionOrder $production_order)
    {
        $this->authorizeOrFail('production.production-order.index');

        $production_order->load([
            "billOfMaterial",
            "financeYear",
            "user",
            "warehouse",
            "workstation",
        ]);

        $productionOrder = (object) [
            'id' => $production_order->id,
            'date' => $production_order->date,
            "bom_id" => $production_order->billOfMaterial->id,
            "bom_code" => $production_order->billOfMaterial->code,
            "product_id" => $production_order->billOfMaterial->product->id,
            "product" => $production_order->billOfMaterial->product->name,
            "finance_year" => $production_order->financeYear->name,
            "warehouse" => $production_order->warehouse->name,
            "work_station" => $production_order->workStation->name,
            "quantity" => $production_order->quantity,
            "unit" => $production_order->billOfMaterial->product->unit->short_name,
            "estimated_cost" => $production_order->cost,
            "other_cost" => $production_order->other_cost,
            "start_at" => $production_order->start_at,
            "end_at" => $production_order->end_at,
            "status" => $production_order->status,
            "user_id" => $production_order->user->name,
        ];


        return Inertia::render('Production/ProductionPlan/Show', [
            'productionOrder' => $productionOrder,
            'breadcrumb' => Breadcrumbs::generate('production.production-order.show', $production_order)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductionOrder $production_order)
    {
        $this->authorizeOrFail('production.production-order.edit');

        $BOMs = BillOfMaterial::active()->with(['product', 'materials'])->get();

        $BOMs = $BOMs->map(function ($bom) {
            return (object) [
                'id' => $bom->id,
                'code' => $bom->code,
                'product' => $bom->product->name,
                'total' => $bom->materials->reduce(function ($acc, $material) {
                    $unitCost = $material->unit->operator === "*"
                        ? $material->product->cost
                        : $material->product->cost / $material->unit->operator_value;

                    return $acc + ($material->quantity * $unitCost);
                }, 0),
                'overhead_cost' => $bom->overhead_cost,
                'other_cost' => $bom->other_cost,
            ];
        });
        $workStations = WorkStation::active()->select(['id', 'name'])->get();
        $warehouses = Warehouse::active()->select(['id', 'name'])->get();

        return Inertia::render('Production/ProductionPlan/Edit', [
            'productionOrder' => $production_order,
            'BOMs' => $BOMs,
            'workStations' => $workStations,
            'warehouses' => $warehouses,
            'currentData' => Carbon::today()->format('Y-m-d'),
            'breadcrumb' => Breadcrumbs::generate('production.production-order.edit', $production_order)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductionOrder $production_order)
    {
        $this->authorizeOrFail('production.production-order.edit');
        $request->validate([
            "date" => ["required"],
            "bill_of_material" => ["required", Rule::exists(BillOfMaterial::class, 'id')],
            "warehouse" => ["required", Rule::exists(Warehouse::class, 'id')],
            "work_station" => ["required", Rule::exists(WorkStation::class, 'id')],
            "quantity" => ["required"],
            "cost" => ['required'],
            "other_cost" => ['required'],
            "start_at" => ["required"],
            "end_at" => ["required"],
        ]);
        try {
            $production_order->update([
                "date" => $request->date,
                "bill_of_material_id" => $request->bill_of_material,
                "warehouse_id" => $request->warehouse,
                "work_station_id" => $request->work_station,
                "quantity" => $request->quantity,
                "cost" => $request->cost,
                "other_cost" => $request->other_cost,
                "start_at" => $request->start_at,
                "end_at" => $request->end_at,
                "user_id" => Auth::user()->id,
            ]);

            return redirect()->back()->with('success', 'Production order updated');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductionOrder $production_order)
    {
        $this->authorizeOrFail('production.production-order.delete');
        try {
            $production_order->delete();
            return redirect()->back()->with('success', 'Production order deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
