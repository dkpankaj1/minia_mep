<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Http\Resources\Purchase\PurchaseResource;
use App\Models\Company;
use App\Models\Purchase;
use App\Models\SystemSetting;
use Barryvdh\DomPDF\Facade\Pdf;

class PurchaseInvoicePrintController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Purchase $purchase)
    {
        // return view('invoices.purchase.pdf', [
        //     'purchase' => $purchase,
        //     'system' => SystemSetting::with('currency')->first(),
        //     'company' => Company::first(),
        // ]);

        $pdf = Pdf::loadView('invoices.purchase.pdf', [
            'purchase' => $purchase,
            'system' => SystemSetting::with('currency')->first(),
            'company' => Company::first(),
        ])->setPaper('a4');

        return $pdf->stream();


    }
}
