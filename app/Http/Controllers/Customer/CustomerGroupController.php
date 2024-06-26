<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerGroup;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log; // Import Log facade

class CustomerGroupController extends Controller
{
    use AuthorizationFilter;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $this->authorizeOrFail('customer-group.index');

            $customerGroups = CustomerGroup::latest()->paginate();
            $customerGroupsCount = CustomerGroup::count();
            $breadcrumb = Breadcrumbs::generate('customer-group.index');

            return Inertia::render('Customers/CustomerGroup/Index', compact('customerGroups', 'customerGroupsCount', 'breadcrumb'));
        } catch (\Exception $e) {
            Log::error('Error in index method: ' . $e->getMessage());
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $this->authorizeOrFail('customer-group.create');

            $request->validate([
                "name" => ['required', Rule::unique(CustomerGroup::class, 'name')],
                "calculate_rate" => ['nullable', 'numeric', 'between:-100,100'],
                "description" => ['nullable'],
            ]);

            CustomerGroup::create([
                'name' => $request->name,
                'calculate_rate' => $request->calculate_rate ?? null,
                'description' => $request->description,
            ]);

            return redirect()->route('customer-group.index')->with('success', 'Customer group created.');
        } catch (\Exception $e) {
            Log::error('Error creating customer group: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CustomerGroup $customer_group)
    {
        try {
            $this->authorizeOrFail('customer-group.edit');

            $request->validate([
                "name" => ['required', Rule::unique(CustomerGroup::class, 'name')->ignore($customer_group->id)],
                "calculate_rate" => ['nullable', 'numeric', 'between:-100,100'],
                "description" => ['nullable'],
            ]);

            $customer_group->update([
                'name' => $request->name,
                'calculate_rate' => $request->calculate_rate,
                'description' => $request->description,
            ]);

            return redirect()->route('customer-group.index')->with('success', 'Customer group updated.');
        } catch (\Exception $e) {
            Log::error('Error updating customer group: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerGroup $customer_group)
    {
        try {
            $this->authorizeOrFail('customer-group.delete');

            $customer_group->delete();

            return redirect()->route('customer-group.index')->with('success', 'Customer group deleted.');
        } catch (\Exception $e) {
            Log::error('Error deleting customer group: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
