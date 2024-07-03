<?php

namespace App\Http\Resources\Sale;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
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
            'invoice_id' => $this->invoice_id,
            'date' => $this->date,
            'customer' => $this->customer,
            'finance_year' => $this->financeYear,
            'warehouse' => $this->warehouse,
            'total_cost' => $this->total_cost,
            'discount_method' => $this->discount_method,
            'discount' => $this->discount,
            'tax_rate' => $this->tax_rate,
            'total_tax' => $this->total_tax,
            'other_cost' => $this->other_cost,
            'grand_total' => $this->grand_total,
            'paid_amount' => $this->paid_amount,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'user' => $this->user->email,
        ];
    }
}
