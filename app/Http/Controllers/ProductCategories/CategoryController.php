<?php

namespace App\Http\Controllers\ProductCategories;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('category.index');

        $limit = $request->query('limit', 10);
        $categoryQuery = Category::query();

        if ($request->search) {
            $searchTerm = "%{$request->search}%";
            $categoryQuery->where('name', 'like', $searchTerm);
        }

        return Inertia::render('ProductCategories/Category/Index', [
            'categories' => $categoryQuery->latest()->paginate($limit),
            'categoryCount' => Category::count(),
            'breadcrumb' => Breadcrumbs::generate('category.index'),
            'queryParam' => request()->query() ?: null,
        ]);

    }

    public function store(Request $request)
    {
        $this->authorizeOrFail('category.create');

        $request->validate([
            'name' => ['required', 'string', Rule::unique(Category::class, 'name')],
            'description' => ['nullable', 'string']
        ]);
        try {
            Category::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);
            return redirect()->route('category.index')->with('success', "category created");
        } catch (\Exception $e) {
            return redirect()->route('category.index')->with('danger', $e->getMessage());
        }

    }

    public function update(Request $request, Category $category)
    {
        $this->authorizeOrFail('category.edit');

        $request->validate([
            'name' => ['required', 'string', Rule::unique(Category::class, 'name')->ignore($category->id)],
            'description' => ['nullable', 'string']
        ]);

        try {
            $category->update([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            return redirect()->route('category.index')->with('success', "category updated");
        } catch (\Exception $e) {
            return redirect()->route('category.index')->with('danger', $e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        $this->authorizeOrFail('category.delete');
        try {
            $category->delete();
            return redirect()->route('category.index')->with('success', "category deleted");
        } catch (\Exception $e) {
            return redirect()->route('category.index')->with('danger', $e->getMessage());
        }
    }

}
