<?php

namespace App\Http\Controllers\BillOfMaterial;

use App\Http\Controllers\Controller;
use App\Models\BillOfMaterial;
use App\Models\Company;
use App\Models\SystemSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class BillOfMaterialPrintController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(BillOfMaterial $bill_of_material)
    {

        $bill_of_material->load([
            'product:id,name,code,cost',
            'materials.product:id,name,code,cost',
            'materials.unit:*',
        ]);

        $bomData = (object) [
            'id' => $bill_of_material->id,
            'product' => $bill_of_material->product->name,
            'productCode' => $bill_of_material->product->code,
            'materials' => $bill_of_material->materials->map(function ($material) {
                $unitCost = $material->unit->operator === "*"
                    ? $material->product->cost
                    : ($material->product->cost / $material->unit->operator_value) * $material->quantity;

                return (object) [
                    'id' => $material->product->id,
                    'name' => $material->product->name,
                    'code' => $material->product->code,
                    'quantity' => $material->quantity,
                    'unit' => $material->unit,
                    'cost' => $material->product->cost,
                    'unit_cost' => $unitCost,
                ];
            }),
            'total' => $bill_of_material->materials->reduce(function ($acc, $material) {
                $unitCost = $material->unit->operator === "*"
                    ? $material->product->cost
                    : $material->product->cost / $material->unit->operator_value;

                return $acc + ($material->quantity * $unitCost);
            }, 0),
            'overhead_cost' => $bill_of_material->overhead_cost,
            'other_cost' => $bill_of_material->other_cost,
            'created_at' => $bill_of_material->created_at
        ];

        // return view('production.billOfMaterial', [
        //     'billOfMaterial' => $bomData,
        //     'system' => SystemSetting::with('currency')->first(),
        //     'company' => Company::first(),
        // ]);

        $pdf = Pdf::loadView('production.billOfMaterial', [
            'billOfMaterial' => $bomData,
            'system' => SystemSetting::with('currency')->first(),
            'company' => Company::first(),
        ])->setPaper('a4');

        return $pdf->stream('download.pdf');
    }
}
