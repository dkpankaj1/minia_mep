<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Models\Supplier;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('supplier.index');

        return Inertia::render('Supplier/List', [
            'suppliers' => Supplier::latest()->paginate(),
            'supplierCount' => Supplier::count(),
            'breadcrumb' => Breadcrumbs::generate('supplier.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('supplier.create');

        return Inertia::render('Supplier/Create', [
            'breadcrumb' => Breadcrumbs::generate('supplier.create')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        $this->authorizeOrFail('supplier.create');

        try {
            $data = [
                'company' => $request->company,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'whatsapp' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'is_active' => $request->is_active,
            ];

            Supplier::create($data);

            return redirect()->route('supplier.index')->with('success', 'supplier created.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        $this->authorizeOrFail('supplier.index');

        return Inertia::render('Supplier/Show', [
            'supplier' => $supplier,
            'breadcrumb' => Breadcrumbs::generate('supplier.show',$supplier)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        $this->authorizeOrFail('supplier.edit');

        return Inertia::render('Supplier/Edit', [
            'supplier' => $supplier,
            'breadcrumb' => Breadcrumbs::generate('supplier.edit',$supplier)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $this->authorizeOrFail('supplier.edit');

        try {
            $data = [
                'company' => $request->company,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'whatsapp' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'is_active' => $request->is_active,
            ];

            $supplier->update($data);

            return redirect()->route('supplier.index')->with('success', 'supplier updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $this->authorizeOrFail('supplier.delete');

        try {
            $supplier->delete();
            return redirect()->route('supplier.index')->with('success', 'supplier deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
