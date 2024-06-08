<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Product::all();
    }
    public function map($product): array
    {
        return [
            $product->id,
            $product->code,
            $product->name,
            $product->barcode_symbology,
            $product->category->name,
            $product->subCategory->name,
            $product->brand->name,
            $product->unit->name,
            $product->purchaseUnit->name,
            $product->saleUnit->name,
            $product->cost,
            $product->price,
            $product->tax_method,
            $product->net_tax,
            $product->is_batch ? "Yes" : "No",
            $product->expiration_alert ?? "None",
            $product->stock_alert,
            $product->is_active ? "Active" : "InActive",
            $product->description,

        ];
    }
    public function headings(): array
    {
        return [
            'ID',
            'Code',
            'Name',
            'Barcode Symbology',
            'Category',
            'Sub Category',
            'Brand',
            'Unit',
            'Purchase Unit',
            'Sale Unit',
            'Cost',
            'Price',
            'Tax Method',
            'Net Tax',
            'Is Batch',
            'Expiration Alert',
            'Stock Alert',
            'Is Active',
            'Description',
        ];
    }
}
