<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EditPurchaseResource extends JsonResource
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
            'supplier' => $this->supplier_id,
            'warehouse' => $this->warehouse_id,
            'order_status' => $this->order_status,
            'purchase_item' => EditPurchaseItemsResource::collection($this->purchaseItems),
            'shipping_cost' => $this->shipping_cost,
            'other_cost' => $this->other_cost,
            'order_tax' => $this->tax_rate,
            'discount_method' => $this->discount_method,
            'discount' => $this->discount,
            'note' => $this->note
        ];
    }
}
