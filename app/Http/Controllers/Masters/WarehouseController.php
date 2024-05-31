<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use App\Http\Requests\Masters\StoreWareHouseRequest;
use App\Http\Requests\Masters\UpdateWareHouseRequest;
use App\Models\Warehouse;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Masters/WarehouseMaster/Index', [
            'warehouses' => Warehouse::latest()->paginate(),
            'warehouseCount' => Warehouse::count(),
            'breadcrumb' => Breadcrumbs::generate('warehouse.index')
        ]);

    }
    public function create()
    {

    }
    public function store(StoreWareHouseRequest $request)
    {

        try {
            Warehouse::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'is_active' => $request->is_active
            ]);
            return redirect()->route('warehouse.index')->with('success', 'Warehouse created');
        } catch (\Exception $e) {
            return redirect()->route('warehouse.index')->with('danger', $e->getMessage());
        }

    }
    public function show(Warehouse $warehouse)
    {

    }
    public function edit(Warehouse $warehouse)
    {

    }
    public function update(UpdateWareHouseRequest $request, Warehouse $warehouse)
    {
        try {
            $warehouse->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'is_active' => $request->is_active
            ]);
            return redirect()->route('warehouse.index')->with('success', 'Warehouse updated');
        } catch (\Exception $e) {
            return redirect()->route('warehouse.index')->with('danger', $e->getMessage());
        }
    }
    public function destroy(Warehouse $warehouse)
    {
        try {

            if ($warehouse->id == 1) {
                throw new \Exception("The warehouse with ID 1 cannot be deleted.");
            }

            $warehouse->delete();
            return redirect()->route('warehouse.index')->with('success', 'Warehouse deleted');
        } catch (\Exception $e) {
            return redirect()->route('warehouse.index')->with('danger', $e->getMessage());
        }
    }
}
