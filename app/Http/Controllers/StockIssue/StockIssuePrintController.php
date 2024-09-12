<?php

namespace App\Http\Controllers\StockIssue;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\StockIssue;
use App\Models\SystemSetting;
use Barryvdh\DomPDF\Facade\Pdf;

class StockIssuePrintController extends Controller
{
    public function __invoke(StockIssue $stockIssue)
    {
        $stockIssue->load([
            "productionOrder",
            "productionOrder.billOfMaterial",
            "productionOrder.billOfMaterial.product",
            "productionOrder.billOfMaterial.product.unit",
            "productionOrder.workstation",
            "productionOrder.warehouse",
            "stockIssueItems",
            "stockIssueItems.unit",
            "stockIssueItems.productWarehouse.product",
            "stockIssueItems.stockIssueItemBatches.productBatch",

        ]);
        // return view('production.issueStock', [
        //     'stockIssue' => $stockIssue,
        //     'system' => SystemSetting::with('currency')->first(),
        //     'company' => Company::first(),
        // ]);

        $pdf = Pdf::loadView('production.issueStock', [
            'stockIssue' => $stockIssue,
            'system' => SystemSetting::with('currency')->first(),
            'company' => Company::first(),
        ])->setPaper('a4');

        return $pdf->stream('stockIssue_' . $stockIssue->code . '.pdf');
    }
}
