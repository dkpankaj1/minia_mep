<?php

namespace App\Http\Controllers\Products;

use App\Exports\ProductsExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ProductExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        Log::info('Exporting product');

        try{
            return Excel::download(new ProductsExport,'products.xlsx');
        }catch(\Exception $e){
            Log::error('Error exporting product: ' . $e->getMessage());
        }
    }
}
