<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\CompanyUpdateRequest;
use App\Models\Company;
use App\Traits\AuthorizationFilter;
use App\Traits\ImageManager;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    use AuthorizationFilter, ImageManager;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('company.index');

        return Inertia::render('Settings/CompanySetting', [
            'companySetting' => Company::firstOrCreate(),
            'breadcrumb' => Breadcrumbs::generate('company.index')
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CompanyUpdateRequest $request, Company $company)
    {

        $this->authorizeOrFail('company.edit');

        try {
            // Update the company record
            $company->update([
                'name' => $request->name,
                'short_name' => $request->short_name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
            ]);
            if ($request->hasFile('logo')) {
                $company->update([
                    'logo' => $this->base64FromRequest($request->file('logo')->getRealPath(), null, 200)
                ]);
            }
            return redirect()->route('company.index')->with('success', 'Update successful');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        //
    }
}
