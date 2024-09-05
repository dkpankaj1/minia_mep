<?php

namespace App\Http\Controllers;

use App\Http\Resources\Production\BillOfMaterial\FinishProductList;
use App\Http\Resources\Production\BillOfMaterial\RawProductList;
use App\Models\BillOfMaterial;
use App\Models\Product;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillOfMaterialController extends Controller
{
    use AuthorizationFilter;
    public function index()
    {
        $this->authorizeOrFail('production.bill-of-material.index');

        $billOfMaterials = BillOfMaterial::with(['product'])->get();

        return Inertia::render('Production/BillOfMaterial/List', [
            'billOfMaterials' => $billOfMaterials,
            'bomCount' => BillOfMaterial::count(),
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.index')
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
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.create')
        ]);


    }
    public function store(Request $request)
    {
        $this->authorizeOrFail('production.bill-of-material.create');

    }
    public function show(BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.index');
        return Inertia::render('Production/BillOfMaterial/Show');


    }
    public function edit(BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.edit');
        return Inertia::render('Production/BillOfMaterial/Edit', [
            'breadcrumb' => Breadcrumbs::generate('production.bill-of-material.edit', $bill_of_material)
        ]);


    }
    public function update(Request $request, BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.edit');

    }
    public function destroy(BillOfMaterial $bill_of_material)
    {
        $this->authorizeOrFail('production.bill-of-material.delete');

    }
}
