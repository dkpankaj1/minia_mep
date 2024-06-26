<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Exports\CustomerExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log; // Import Log facade

class CustomerExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {

            return Excel::download(new CustomerExport, 'customers.xlsx');

        } catch (\Exception $e) {
            Log::channel('custom')->error('CustomerExportController@__invoke', ['error' => $e->getMessage()]);
            return redirect()->back()->with('danger', 'An error occurred while exporting customers. Please try again later.');

        }
    }
}
