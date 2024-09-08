<?php

namespace App\Http\Controllers\BillOfMaterial;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillOfMaterial\StoreBOMRequest;
use App\Http\Requests\BillOfMaterial\UpdateBOMRequest;
use App\Http\Resources\Production\BillOfMaterial\FinishProductList;
use App\Http\Resources\Production\BillOfMaterial\RawProductList;
use App\Models\BillOfMaterial;
use App\Models\Material;
use App\Models\Product;
use App\Traits\AuthorizationFilter;
use Carbon\Carbon;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BillOfMaterialController extends Controller
{
    use AuthorizationFilter;


    public function index(Request $request)
    {
        $this->authorizeOrFail('production.bill-of-material.index');
        $billOfMaterialQuery = BillOfMaterial::with([
            'product:id,name',
            'materials' => function ($query) {
                $query->select(['id', 'bill_of_material_id', 'product_id', 'quantity', 'unit_id'])
                    ->with(['product:id,name,code,cost', 'unit:id,operator,operator_value']);
            }
        ]);
        $limit = $request->query('limit', 10);
        if ($request->search) {
            $searchTerm = '%' . $request->search . '%';
            $billOfMaterialQuery = $billOfMaterialQuery->whereHas(
                'product',
                function ($query) use ($searchTerm) {
                    $query->where('name', 'like', $searchTerm);
                }
            )->orWhere('code', 'like', $searchTerm);
        }
        $billOfMaterials = $billOfMaterialQuery->latest()->paginate($limit)->withQueryString();
        $billOfMaterialCollection = $billOfMaterials->getCollection()->transform(function ($bom) {
            $materialCost = $bom->materials->reduce(function ($total, $material) {
                $amount = $material->unit->operator === "*"
                    ? $material->product->cost
                    : $material->product->cost / $material->unit->operator_value;
                return $total + ($amount * $material->quantity);
            }, 0);
            return [
                'id' => $bom->id,
                'code' => $bom->code,
                'product' => $bom->product->name,
                'material_cost' => $materialCost,
                'overhead_cost' => $bom->overhead_cost,
                'other_cost' => $bom->other_cost,
                'created_at' => $bom->created_at->format('Y-m-d'),
                'updated_at' => $bom->updated_at->format('Y-m-d'),
            ];
        });
        return Inertia::render('Production/BillOfMaterial/List', [
            'billOfMaterials' => [
                'data' => $billOfMaterialCollection,
                'links' => $billOfMaterials->linkCollection()->toArray(),
            ],
            'bomCount' => BillOfMaterial::count(),
            'queryParam' => request()->query() ?: null,
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.index'),
        ]);
    }


    public function create()
    {
        $this->authorizeOrFail('production.bill-of-material.create');

        $finishProduct = Product::with('unit')->where('category_id', 1)->active()->get();
        $rawProduct = Product::with('unit')->where('category_id', 2)->active()->get();

        return Inertia::render('Production/BillOfMaterial/Create', [
            'finishProduct' => FinishProductList::collection($finishProduct),
            'rawProduct' => RawProductList::collection($rawProduct),
            'nextCode' => $this->generateBOMCode(),
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.create')
        ]);
    }
    public function store(StoreBOMRequest $request)
    {
        $this->authorizeOrFail('production.bill-of-material.create');
        try {
            DB::transaction(function () use ($request) {
                $materialsObj = collect($request->materials);
                $data = [
                    'code' => $request->code,
                    "product_id" => $request->product,
                    "overhead_cost" => $request->overhead_cost,
                    "other_cost" => $request->other_cost,
                    "notes" => "No Notes",
                    "status" => 1
                ];
                $bom = BillOfMaterial::create($data);
                $materials = $materialsObj->map(function ($material) use ($bom) {
                    $currentDate = Carbon::now();
                    return [
                        'bill_of_material_id' => $bom->id,
                        'product_id' => $material['id'],
                        'quantity' => $material['quantity'],
                        'unit_id' => $material['unit']['id'],
                        'created_at' => $currentDate,
                        'updated_at' => $currentDate,
                    ];
                })->toArray();
                Material::insert($materials);
            }, 10);
            return redirect()->route('production.bill-of-material.index')->with('success', 'Bill of material created.');
        } catch (Exception $e) {
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }
    public function show(BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.index');

        $bill_of_material->load([
            'product:*',
            'materials.product:id,name,code,cost',
            'materials.unit:*',
        ]);

        $bomData = [
            'id' => $bill_of_material->id,
            'code' => $bill_of_material->code,
            'product' => $bill_of_material->product->name,
            'product_code' => $bill_of_material->product->code,
            'materials' => $bill_of_material->materials->map(function ($material) {
                $unitCost = $material->unit->operator === "*"
                    ? $material->product->cost
                    : $material->product->cost / $material->unit->operator_value;

                return [
                    'id' => $material->product->id,
                    'name' => $material->product->name,
                    'code' => $material->product->code,
                    'quantity' => $material->quantity,
                    'unit' => $material->unit,
                    'cost' => $material->product->cost,
                    'unit_cost' => $unitCost,
                ];
            }),
            'total' => $bill_of_material->materials->reduce(function ($acc, $material) {
                $unitCost = $material->unit->operator === "*"
                    ? $material->product->cost
                    : $material->product->cost / $material->unit->operator_value;

                return $acc + ($material->quantity * $unitCost);
            }, 0),
            'overhead_cost' => $bill_of_material->overhead_cost,
            'other_cost' => $bill_of_material->other_cost,
        ];
        return Inertia::render('Production/BillOfMaterial/Show', [
            'billOfMaterial' => $bomData,
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.show', $bill_of_material),
        ]);
    }

    public function edit(BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.edit');
        $bill_of_material->load([
            'product:id,name,code,cost',
            'materials.product:id,name,code,cost',
            'materials.unit:*',
        ]);
        $bomData = [
            'id' => $bill_of_material->id,
            'code' => $bill_of_material->code,
            'product' => $bill_of_material->product->id,
            'materials' => $bill_of_material->materials->map(function ($material) {
                $unitCost = $material->unit->operator === "*"
                    ? $material->product->cost
                    : $material->product->cost / $material->unit->operator_value;

                return [
                    'id' => $material->product->id,
                    'name' => $material->product->name,
                    'code' => $material->product->code,
                    'quantity' => $material->quantity,
                    'unit' => $material->unit,
                    'cost' => $material->product->cost,
                    'unit_cost' => $unitCost,
                ];
            }),
            'overhead_cost' => $bill_of_material->overhead_cost,
            'other_cost' => $bill_of_material->other_cost,
        ];
        $finishProduct = Product::with('unit')->where('category_id', 1)->active()->get();
        $rawProduct = Product::with('unit')->where('category_id', 2)->active()->get();
        return Inertia::render('Production/BillOfMaterial/Edit', [
            'billOfMaterial' => $bomData,
            'finishProduct' => FinishProductList::collection($finishProduct),
            'rawProduct' => RawProductList::collection($rawProduct),
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.edit', $bill_of_material),
        ]);
    }


    public function update(UpdateBOMRequest $request, BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.edit');
        try {
            DB::transaction(function () use ($request, $bill_of_material) {
                $bill_of_material->materials()->delete();
                $data = [
                    "code" => $request->code,
                    "product_id" => $request->product,
                    "overhead_cost" => $request->overhead_cost,
                    "other_cost" => $request->other_cost,
                    "notes" => $request->notes ?? 'No Notes',
                    "status" => 1
                ];
                $bill_of_material->update($data);
                $currentDate = Carbon::now();
                $materials = collect($request->materials)->map(function ($material) use ($bill_of_material, $currentDate) {
                    return [
                        'bill_of_material_id' => $bill_of_material->id,
                        'product_id' => $material['id'],
                        'quantity' => $material['quantity'],
                        'unit_id' => $material['unit']['id'],
                        'created_at' => $currentDate,
                        'updated_at' => $currentDate,
                    ];
                })->toArray();
                Material::insert($materials);
            }, 10);
            return redirect()->route('production.bill-of-material.index')->with('success', 'Bill of material updated.');
        } catch (Exception $e) {
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    public function destroy(BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.delete');
        try {
            DB::transaction(function () use ($bill_of_material) {
                $bill_of_material->materials()->delete();
                $bill_of_material->delete();
            }, 10);
            return redirect()->back()->with('success', 'Bill of material deleted.');
        } catch (Exception $e) {
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    protected function generateBOMCode()
    {
        $nextId = BillOfMaterial::max('id') ?? 0;
        do {
            $nextId += 1;
            $bomCode = 'BOM' . str_pad($nextId, 6, '0', STR_PAD_LEFT);

        } while (BillOfMaterial::where('code', $bomCode)->exists());
        return $bomCode;
    }
}
