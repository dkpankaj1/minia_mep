<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Http\Resources\Product\ListProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductWarehouse;
use App\Models\SubCategory;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Traits\AuthorizationFilter;
use App\Traits\ImageManager;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    use AuthorizationFilter, ImageManager;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('product.index');

        return Inertia::render('Products/List', [
            'products' => ListProductResource::collection(Product::with(['category', 'subCategory', 'brand', 'unit', 'purchaseUnit', 'saleUnit'])->latest()->get()),
            // 'products' => ListProductResource::collection(Product::with(['category', 'subCategory', 'brand', 'unit', 'purchaseUnit', 'saleUnit'])->latest('updated_at')->get()),
            'productCount' => Product::count(),
            'breadcrumb' => Breadcrumbs::generate('product.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('product.create');

        return Inertia::render('Products/Create', [
            'brands' => Brand::all(),
            'breadcrumb' => Breadcrumbs::generate('product.create'),
            'categories' => Category::with('subCategory')->get(),
            'units' => Unit::whereNull('base_unit')->active()->with([
                'subUnits' => function ($query) {
                    $query->active();
                }
            ])->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $this->authorizeOrFail('product.create');

        try {
            DB::transaction(function () use ($request) {
                // Extract product data
                $productData = [
                    'code' => $request->code,
                    'barcode_symbology' => $request->barcode_symbology,
                    'category_id' => $request->category,
                    'sub_category_id' => $request->sub_category,
                    'brand_id' => $request->brand,
                    'name' => $request->name,
                    'unit_id' => $request->unit,
                    'purchase_unit_id' => $request->purchase_unit,
                    'sale_unit_id' => $request->sale_unit,
                    'cost' => $request->cost,
                    'price' => $request->price,
                    'tax_method' => $request->tax_method,
                    'net_tax' => $request->net_tax,
                    'is_batch' => $request->is_batch,
                    'expiration_alert' => $request->expiration_alert ?? null,
                    'stock_alert' => $request->stock_alert,
                    'is_active' => $request->is_active,
                    'description' => $request->description,
                ];

                // Create product
                $product = Product::create($productData);

                // Handle product image
                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    $product->update(['image' => $this->base64FromRequest($image->getRealPath(), 200, 200)]);
                }


                // Insert product into warehouses
                $warehouses = Warehouse::pluck('id')->toArray();

                if (!empty($warehouses)) {
                    $productWarehouseData = [];

                    foreach ($warehouses as $warehouseId) {
                        $productWarehouseData[] = [
                            'product_id' => $product->id,
                            'warehouse_id' => $warehouseId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    ProductWarehouse::insert($productWarehouseData);
                }

            });

            return redirect()->route('product.index')->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $this->authorizeOrFail('product.index');

        return Inertia::render(
            'Products/Show',
            [
                'breadcrumb' => Breadcrumbs::generate('product.show', $product),
                'product' => Product::with([
                    'brand',
                    'category',
                    'unit',
                    'purchaseUnit',
                    'saleUnit',
                    'subCategory',
                ])->find($product->id)
            ]
        );


    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $this->authorizeOrFail('product.edit');

        return Inertia::render('Products/Edit', [
            'brands' => Brand::all(),
            'breadcrumb' => Breadcrumbs::generate('product.create'),
            'categories' => Category::with('subCategory')->get(),
            'product' => $product,
            'product_subcategory' => SubCategory::where('category_id', $product->category_id)->get(),
            'product_unit' => Unit::where('base_unit', $product->unit_id)->orWhere('id', $product->unit_id)->get(),
            'units' => Unit::whereNull('base_unit')->with([
                'subUnits' => function ($query) {
                    $query->active();
                }
            ])->get(),
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorizeOrFail('product.edit');

        try {
            DB::transaction(function () use ($request, $product) {

                // Extract product data
                $productData = [
                    'code' => $request->code,
                    'barcode_symbology' => $request->barcode_symbology,
                    'category_id' => $request->category,
                    'sub_category_id' => $request->sub_category,
                    'brand_id' => $request->brand,
                    'name' => $request->name,
                    'unit_id' => $request->unit,
                    'purchase_unit_id' => $request->purchase_unit,
                    'sale_unit_id' => $request->sale_unit,
                    'cost' => $request->cost,
                    'price' => $request->price,
                    'tax_method' => $request->tax_method,
                    'net_tax' => $request->net_tax,
                    'is_batch' => $request->is_batch,
                    'expiration_alert' => $request->expiration_alert ?? null,
                    'stock_alert' => $request->stock_alert,
                    'is_active' => $request->is_active,
                    'description' => $request->description,
                    // 'updated_at' => Carbon::now()
                ];

                if ($request->remove_old_image) {
                    $productData['image'] = null;
                }

                // Handle product image
                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    $productData['image'] = $this->base64FromRequest($image->getRealPath(), 200, 200);
                }
                // Update product
                $product = $product->update($productData);

            });

            return redirect()->back()->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorizeOrFail('product.delete');

        try {

            // delete product from warehouse
            // ProductWarehouse::where('product_id', $product->id)->delete();
            $product->productWarehouses()->delete();
            // delete product
            $product->delete();

            return redirect()->route('product.index')->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
