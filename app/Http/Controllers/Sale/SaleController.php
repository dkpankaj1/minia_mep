<?php

namespace App\Http\Controllers\Sale;

use App\Helpers\StockManager;
use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('sale.index');

        return Inertia::render('Sale/List', [
            'sales' => ['data' => [],],
            'breadcrumb' => Breadcrumbs::generate('sale.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('sale.create');

        return (StockManager::getAllStock());
        
        // return Inertia::render('Sale/Create', [
        //     'product' => StockManager::getAllStock(),
        //     'breadcrumb' => Breadcrumbs::generate('sale.index')
        // ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorizeOrFail('sale.create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $this->authorizeOrFail('sale.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        $this->authorizeOrFail('sale.edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $this->authorizeOrFail('sale.edit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $this->authorizeOrFail('sale.delete');
    }
}
