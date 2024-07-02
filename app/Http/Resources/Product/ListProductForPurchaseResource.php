<?php

namespace App\Http\Resources\Product;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListProductForPurchaseResource extends JsonResource
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
            'name' => $this->name,
            'unit' => $this->unit,
            'purchase_unit' => $this->purchaseUnit->id,
            'available_unit' => $this->getAvailableUnits(),
            'cost' => $this->cost,
            'price' => $this->price,
            'tax_method' => $this->tax_method,
            'net_tax' => $this->net_tax,
            'is_batch' => $this->is_batch,
            'product_warehouses' => $this->productWarehouses,
        ];
    }
}
