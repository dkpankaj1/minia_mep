<?php

namespace App\Http\Controllers\People;

use App\Http\Controllers\Controller;

use App\Models\CustomerGroup;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerGroupController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('customer-group.index');

        return Inertia::render('People/CustomerGroup/Index', [
            'customerGroups' => CustomerGroup::latest()->paginate(),
            'customerGroupsCount' => CustomerGroup::count(),
            'breadcrumb' => Breadcrumbs::generate('customer-group.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $this->authorizeOrFail('customer-group.store');

        $request->validate([
            "name" => ['required', Rule::unique(CustomerGroup::class, 'name')],
            "calculate_rate" => ['nullable', 'numeric', 'between:-100,100'],
            "description" => ['nullable'],
        ]);

        try {

            CustomerGroup::create([
                'name' => $request->name,
                'calculate_rate' => $request->calculate_rate ?? null,
                'description' => $request->description,
            ]);

            return redirect()->route('customer-group.index')->with('success', 'customerGroup created.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerGroup $customerGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomerGroup $customerGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CustomerGroup $customer_group)
    {
        $this->authorizeOrFail('customer-group.edit');

        $request->validate([
            "name" => ['required', Rule::unique(CustomerGroup::class, 'name')->ignore($customer_group->id)],
            "calculate_rate" => ['nullable', 'numeric', 'between:-100,100'],
            "description" => ['nullable'],
        ]);

        try {

            $customer_group->update([
                'name' => $request->name,
                'calculate_rate' => $request->calculate_rate,
                'description' => $request->description,
            ]);

            return redirect()->route('customer-group.index')->with('success', 'customerGroup updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerGroup $customer_group)
    {
        $this->authorizeOrFail('customer-group.delete');

        try {

            $customer_group->delete();

            return redirect()->route('customer-group.index')->with('success', 'customerGroup deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
