<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseItemsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "code" => $this->product->code,
            "name" => $this->product->name,
            "purchase_unit" => $this->unit,
            "net_unit_cost" => $this->net_unit_cost,
            "quantity" => $this->quantity,
            "discount_method" => $this->discount_method,
            "discount" => $this->discount,
            "tax_method" => $this->tax_method,
            "tax_rate" => $this->tax_rate,
            "is_batch" => $this->product->is_batch,
            "batch" => $this->product->is_batch ? $this->batch->batch : null,
            "expiration" => $this->product->is_batch ? $this->batch->expiration : null,
        ];
    }
}
