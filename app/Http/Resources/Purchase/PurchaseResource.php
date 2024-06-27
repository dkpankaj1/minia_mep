<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
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
            'date' => $this->date,
            'reference' => $this->reference,
            'supplier' => $this->supplier,
            'warehouse' => $this->warehouse,
            'order_status' => $this->order_status,
            'purchase_item' => PurchaseItemsResource::collection($this->purchaseItems),
            'shipping_cost' => $this->shipping_cost,
            'other_cost' => $this->other_cost,
            'order_tax' => $this->tax_rate,
            'discount_method' => $this->discount_method,
            'discount' => $this->discount,
            'sub_total' => $this->total_cost,
            'grand_total' => $this->grand_total,
            'note' => $this->note
        ];
    }
}
