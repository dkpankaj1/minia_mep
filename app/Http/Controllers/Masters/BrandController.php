<?php

namespace App\Http\Controllers\Masters;

use App\Models\Brand;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BrandController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('brand.index');
       
        // Define the columns you need
        $columns = ['id', 'name', 'description']; // Add other necessary columns here

        // Fetch paginated brands with only necessary columns
        $brands = Brand::select($columns)->latest()->paginate(10); // Adjust pagination size as needed

        // Count the total number of brands
        $brandCount = Brand::count();

        // Generate breadcrumb
        $breadcrumb = Breadcrumbs::generate('brand.index');

        return Inertia::render('Masters/BrandMaster/Index', [
            'brands' => $brands,
            'brandCount' => $brandCount,
            'breadcrumb' => $breadcrumb
        ]);
    }


    public function show()
    {

    }

    public function create()
    {

    }

    public function store(Request $request)
    {
        $this->authorizeOrFail('brand.create');

        // Use array validation for better performance
        $validated = $request->validate([
            'name' => 'required|string|unique:brands,name',
            'description' => 'nullable|string'
        ]);

        try {
            // Use the validated data directly to create the brand
            Brand::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? 'no description'
            ]);

            return redirect()->route('brand.index')->with('success', 'Brand created');
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Brand creation failed', ['error' => $e->getMessage()]);

            // Return a generic error message to avoid exposing sensitive information
            return redirect()->back()->with('danger', 'An error occurred while creating the brand.');
        }
    }


    public function edit()
    {

    }

    public function update(Request $request, Brand $brand)
    {
        $this->authorizeOrFail('brand.edit');

        // Validate the request data
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('brands', 'name')->ignore($brand->id)
            ],
            'description' => 'nullable|string'
        ]);

        try {
            // Update the brand using the validated data
            $brand->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? $brand->description
            ]);

            return redirect()->route('brand.index')->with('success', 'Brand updated');
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Brand update failed', ['error' => $e->getMessage()]);

            // Return a generic error message to avoid exposing sensitive information
            return redirect()->back()->with('danger', 'An error occurred while updating the brand.');
        }
    }


    public function destroy(Brand $brand)
    {
        $this->authorizeOrFail('brand.delete');
        
        try {
            
            $brand->delete();
            return redirect()->route('brand.index')->with('success', 'Brand deleted');
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Brand deletion failed', ['error' => $e->getMessage()]);

            // Return a generic error message to avoid exposing sensitive information
            return redirect()->back()->with('danger', 'An error occurred while deleting the brand.');
        }
    }

}
