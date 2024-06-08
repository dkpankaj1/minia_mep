<?php

namespace App\Http\Controllers\Products;

use App\Exports\ProductsExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ProductExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
       return Excel::download(new ProductsExport,'products.xlsx');
    }
}
