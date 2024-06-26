<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\Customer\ListCustomerResource;
use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log; // Import Log facade

class CustomerController extends Controller
{
    use AuthorizationFilter;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $this->authorizeOrFail('customer.index');

            $customers = ListCustomerResource::collection(Customer::with('customerGroup')->latest()->get());
            $customerCount = Customer::count();
            $breadcrumb = Breadcrumbs::generate('customer.index');

            return Inertia::render('Customers/Customer/List', compact('customers', 'customerCount', 'breadcrumb'));
        } catch (\Exception $e) {
            Log::error('Error in index method: ' . $e->getMessage());
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $this->authorizeOrFail('customer.create');

            $customerGroup = CustomerGroup::select(['id', 'name'])->get();
            $breadcrumb = Breadcrumbs::generate('customer.create');

            return Inertia::render('Customers/Customer/Create', compact('customerGroup', 'breadcrumb'));
        } catch (\Exception $e) {
            Log::error('Error in create method: ' . $e->getMessage());
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        try {
            $this->authorizeOrFail('customer.create');

            Customer::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'whatsapp' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'customer_group_id' => $request->customer_group_id,
                'is_active' => $request->is_active,
            ]);

            Log::info('New customer created: ' . $request->name);

            return redirect()->route('customer.index')->with('success', 'Customer created.');
        } catch (\Exception $e) {
            Log::error('Error creating customer: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        try {
            $this->authorizeOrFail('customer.index');

            $customerGroup = CustomerGroup::select(['id', 'name'])->get();
            $breadcrumb = Breadcrumbs::generate('customer.show', $customer);

            return Inertia::render('Customers/Customer/Show', compact('customer', 'customerGroup', 'breadcrumb'));
        } catch (\Exception $e) {
            Log::error('Error in show method: ' . $e->getMessage());
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        try {
            $this->authorizeOrFail('customer.edit');

            $customerGroup = CustomerGroup::select(['id', 'name'])->get();
            $breadcrumb = Breadcrumbs::generate('customer.edit', $customer);

            return Inertia::render('Customers/Customer/Edit', compact('customer', 'customerGroup', 'breadcrumb'));
        } catch (\Exception $e) {
            Log::error('Error in edit method: ' . $e->getMessage());
            return redirect()->back()->with('danger', 'An error occurred. Please try again later.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        try {
            $this->authorizeOrFail('customer.edit');

            $customer->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'whatsapp' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'customer_group_id' => $request->customer_group_id,
                'is_active' => $request->is_active,
            ]);

            Log::info('Customer updated: ' . $customer->name);

            return redirect()->route('customer.index')->with('success', 'Customer updated.');
        } catch (\Exception $e) {
            Log::error('Error updating customer: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        try {
            $this->authorizeOrFail('customer.delete');

            if ($customer->id == 1) {
                throw new \Exception("The customer with ID 1 cannot be deleted.");
            }

            $customer->delete();

            Log::info('Customer deleted: ' . $customer->name);

            return redirect()->route('customer.index')->with('success', 'Customer deleted.');
        } catch (\Exception $e) {
            Log::error('Error deleting customer: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
