<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('customer.index');

        $customersQuery = Customer::query();

        if ($request->has('search')) {
            $customersQuery->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Customers/Customer/List', [
            'customers' => $customersQuery->latest()->paginate()->withQueryString(),
            'customerCount' => Customer::count(),
            'breadcrumb' => Breadcrumbs::generate('customer.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $this->authorizeOrFail('customer.create');

        return Inertia::render('Customers/Customer/Create', [
            'customerGroup' => CustomerGroup::select(['id', 'name'])->get(),
            'breadcrumb' => Breadcrumbs::generate('customer.create')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $this->authorizeOrFail('customer.create');

        try {

            Customer::create(
                [
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
                ]
            );

            return redirect()->route('customer.index')->with('success', 'customer created.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $this->authorizeOrFail('customer.index');

        return Inertia::render('Customers/Customer/Show', [
            'customer' => $customer,
            'customerGroup' => CustomerGroup::select(['id', 'name'])->get(),
            'breadcrumb' => Breadcrumbs::generate('customer.show', $customer)
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        $this->authorizeOrFail('customer.edit');

        return Inertia::render('Customers/Customer/Edit', [
            'customer' => $customer,
            'customerGroup' => CustomerGroup::select(['id', 'name'])->get(),
            'breadcrumb' => Breadcrumbs::generate('customer.edit', $customer)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $this->authorizeOrFail('customer.edit');
        try {

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

            return redirect()->route('customer.index')->with('success', 'customer updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $this->authorizeOrFail('customer.delete');

        try {
            $customer->delete();
            return redirect()->route('customer.index')->with('success', 'customer deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
