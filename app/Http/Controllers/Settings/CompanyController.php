<?php

namespace App\Http\Controllers\Settings;

use App\Enums\DefaultB65ImageEnum;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Traits\AuthorizationFilter;
use App\Traits\ImageManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    use AuthorizationFilter, ImageManager;

    public function __construct()
    {
        $this->authorizeOrFail('company.manage');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $companySetting = Company::firstOrCreate(['id' => 1], [
            "name" => "Company Name Privet Limited",
            "short_name" => "CM PVT.LTD.",
            "phone" => "9794445940",
            "email" => "example@email.com",
            "address" => "company address",
            "city" => " city name",
            "state" => "state name",
            "country" => "india",
            "postal_code" => "273001",
            "logo" => DefaultB65ImageEnum::DEFAULT_LOGO
        ]);
        return Inertia::render('Settings/CompanySetting', [
            'companySetting' => $companySetting
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
    public function update(Request $request, Company $company)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^[0-9]{10}$/',
            'email' => 'required|string|email|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|regex:/^[0-9]{6}$/',
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg', 'max:2048'],
        ]);

        try {
            // Update the company record
            $company->update([
                'name' => $validated['name'],
                'short_name' => $validated['short_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'country' => $validated['country'],
                'postal_code' => $validated['postal_code'],
            ]);

            if ($request->has('logo')) {
                $company->update([
                    'logo' => $this->base64FromRequest($request->file('logo')->getRealPath(),null,200)
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
