<?php

namespace App\Http\Controllers\Sale;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Sale;
use App\Models\SystemSetting;
use Barryvdh\DomPDF\Facade\Pdf;

class SaleInvoicePrintController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Sale $sale)
    {
        $saleData = Sale::where('id', $sale->id)->with([
            'saleItems',
            'saleItems.batches'
        ])->first();
        $saleFormateData = (object) [
            'id' => $saleData->id,
            'date' => $saleData->date,
            'invoice_id' => $saleData->invoice_id,
            'customer' => (object) [
                "name" => $saleData->customer->name,
                "email" => $saleData->customer->email,
                "phone" => $saleData->customer->phone,
                "whatsapp" => $saleData->customer->whatsapp,
                "address" => $saleData->customer->address,
                "city" => $saleData->customer->city,
                "state" => $saleData->customer->state,
                "country" => $saleData->customer->country,
                "postal_code" => $saleData->customer->postal_code,
                'group' => $saleData->customer->customerGroup->name
            ],
            'finance_year' => $saleData->financeYear->name,
            'warehouse' => $saleData->warehouse->name,
            'total_cost' => $saleData->total_cost,
            'discount_method' => $saleData->discount_method,
            'discount' => $saleData->discount,
            'total_tax' => $saleData->total_tax,
            'tax_rate' => $saleData->tax_rate,
            'shipping_cost' => $saleData->shipping_cost,
            'other_cost' => $saleData->other_cost,
            'grand_total' => $saleData->grand_total,
            'paid_amount' => $saleData->paid_amount,
            'order_status' => $saleData->order_status,
            'note' => $saleData->note,
            'sale_items' => $saleData->saleItems->map(function ($saleItem) {
                $product = $saleItem->productWarehouse->product;
                $saleQuantity = $saleItem->quantity * ($saleItem->saleUnit->operator_value ?: 1);


                $itemPrice = $saleItem->net_unit_price + (($saleItem->net_unit_price / 100) * $saleItem->calculate_rate);

                $taxPrice = $saleItem->tax_method !== 0
                    ? (double) $itemPrice * ((double) $saleItem->tax_rate / 100)
                    : 0;

                $price = $itemPrice + $taxPrice;

                $discountedPrice = $saleItem->discount_method === 0
                    ? $price - (double) $saleItem->discount
                    : $price - ($price * ((double) $saleItem->discount / 100));

                $finalPrice = $discountedPrice;

                return (object) [
                    "stock_id" => $saleItem->product_warehouse_id,
                    "product_code" => $product->code,
                    "product_name" => $product->name,
                    'net_unit_price' => $itemPrice,
                    'final_price' => $finalPrice,
                    'sale_unit' => $saleItem->saleUnit,
                    'quantity' => $saleQuantity,
                    'subtotal' => $saleItem->sub_total,
                    'discount_method' => $saleItem->discount_method,
                    'discount' => $saleItem->discount,
                    'tax_method' => $saleItem->tax_method,
                    'tax_rate' => $saleItem->tax_rate,
                    'is_batch' => $product->is_batch,
                    'sale_batches' => $saleItem->batches
                ];
            }),
        ];




        // return view('invoices.sales.pdf', [
        //     'sale' => $sale,
        //     'system' => SystemSetting::with('currency')->first(),
        //     'company' => Company::first(),
        // ]);

        $pdf = Pdf::loadView('invoices.sales.pdf', [
            'sale' => $saleFormateData,
            'system' => SystemSetting::with('currency')->first(),
            'company' => Company::first(),
        ])->setPaper('a4');

        return $pdf->stream("invoice_{$sale->customer->email}.pdf");
    }
}
