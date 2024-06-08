<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'barcode_symbology' => $this->barcode_symbology,
            'category' => $this->category->name,
            'sub_category' => $this->subCategory->name,
            'brand' => $this->brand->name,
            'name' => $this->name,
            'unit' => $this->unit->name,
            'purchase_unit' => $this->purchaseUnit->name,
            'sale_unit' => $this->saleUnit->name,
            'cost' => $this->cost,
            'price' => $this->price,
            'tax_method' => $this->tax_method,
            'net_tax' => $this->net_tax,
            'is_batch' => $this->is_batch,
            'stock_alert' => $this->stock_alert,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'description' => $this->description,
        ];
    }
}
