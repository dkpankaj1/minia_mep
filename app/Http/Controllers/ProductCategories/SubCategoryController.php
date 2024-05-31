<?php

namespace App\Http\Controllers\ProductCategories;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('ProductCategories/SubCategory/Index', [
            'subCategories' => SubCategory::with('category')->latest()->paginate(),
            'subCategoryCount' => SubCategory::count(),
            'categories' => Category::all(),
            'breadcrumb' => Breadcrumbs::generate('sub-category.index')
        ]);

    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', Rule::unique(SubCategory::class, 'name')],
            'category' => ['required',Rule::exists(Category::class,'id')],
            'description' => ['nullable', 'string']
        ]);
        try {
            SubCategory::create([
                'name' => $request->name,
                'category_id' => $request->category,
                'description' => $request->description ?? "none",
            ]);
            return redirect()->route('sub-category.index')->with('success', "subCategory created");
        } catch (\Exception $e) {
            return redirect()->route('sub-category.index')->with('danger', $e->getMessage());
        }

    }

    public function update(Request $request, SubCategory $sub_category)
    {
        $request->validate([
            'name' => ['required', 'string', Rule::unique(SubCategory::class, 'name')->ignore($sub_category->id)],
            'category' => ['required',Rule::exists(Category::class,'id')],
            'description' => ['nullable', 'string']
        ]);

        try {
            $sub_category->update([
                'name' => $request->name,
                'category_id' => $request->category,
                'description' => $request->description ?? $sub_category->description,
            ]);

            return redirect()->route('sub-category.index')->with('success', "subCategory updated");
        } catch (\Exception $e) {
            return redirect()->route('sub-category.index')->with('danger', $e->getMessage());
        }
    }

    public function destroy( SubCategory $sub_category)
    {
        try {
            $sub_category->delete();
            return redirect()->route('sub-category.index')->with('success', "subCategory deleted");
        } catch (\Exception $e) {
            return redirect()->route('sub-category.index')->with('danger', $e->getMessage());
        }
    }
}
