<?php

namespace App\Http\Controllers\ProductCategories;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('sub-category.index');

        $limit = $request->query('limit', 10);
        $subCategoryQuery = SubCategory::query();

        if ($request->search) {
            $searchTerm = "%{$request->search}%";
            $subCategoryQuery->where('name', 'like', $searchTerm);
        }

        return Inertia::render('ProductCategories/SubCategory/Index', [
            'subCategories' => $subCategoryQuery->with('category')->latest()->paginate($limit),
            'subCategoryCount' => SubCategory::count(),
            'categories' => Category::all(),
            'breadcrumb' => Breadcrumbs::generate('sub-category.index'),
            'queryParam' => request()->query() ?: null,
        ]);

    }

    public function store(Request $request)
    {

        $this->authorizeOrFail('sub-category.create');

        $request->validate([
            'name' => ['required', 'string', Rule::unique(SubCategory::class, 'name')],
            'category' => ['required', Rule::exists(Category::class, 'id')],
            'description' => ['nullable', 'string']
        ]);
        try {
            SubCategory::create([
                'name' => $request->name,
                'category_id' => $request->category,
                'description' => $request->description,
            ]);
            return redirect()->route('sub-category.index')->with('success', "subCategory created");
        } catch (\Exception $e) {
            return redirect()->route('sub-category.index')->with('danger', $e->getMessage());
        }

    }

    public function update(Request $request, SubCategory $sub_category)
    {
        $this->authorizeOrFail('sub-category.edit');

        $request->validate([
            'name' => ['required', 'string', Rule::unique(SubCategory::class, 'name')->ignore($sub_category->id)],
            'category' => ['required', Rule::exists(Category::class, 'id')],
            'description' => ['nullable', 'string']
        ]);

        try {
            $sub_category->update([
                'name' => $request->name,
                'category_id' => $request->category,
                'description' => $request->description,
            ]);

            return redirect()->route('sub-category.index')->with('success', "subCategory updated");
        } catch (\Exception $e) {
            return redirect()->route('sub-category.index')->with('danger', $e->getMessage());
        }
    }

    public function destroy(SubCategory $sub_category)
    {
        $this->authorizeOrFail('sub-category.delete');

        try {
            $sub_category->delete();
            return redirect()->route('sub-category.index')->with('success', "subCategory deleted");
        } catch (\Exception $e) {
            return redirect()->route('sub-category.index')->with('danger', $e->getMessage());
        }
    }
}
