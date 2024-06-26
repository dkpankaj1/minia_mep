<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListPurchaseResource extends JsonResource
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
            'finance_year' => $this->financeYear->name,
            'supplier' => $this->supplier->name,
            'warehouse' => $this->warehouse->name,
            'grand_total' => $this->grand_total,
            'paid_amount' => $this->paid_amount,
            'status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'user' => $this->user->name,
        ];
    }
}
