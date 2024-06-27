<?php

namespace App\Http\Resources\Purchase;

use App\Http\Controllers\Purchase\PurchaseHelper;
use App\Models\Unit;
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
            "sub_total" => $this->calculateSubTotal(),
            // "grand_total" => PurchaseHelper::calculateGrandSubTotal($this, $this->tax_rate),
            "is_batch" => $this->product->is_batch,
            "batch" => $this->product->is_batch ? $this->batch->batch : null,
            "expiration" => $this->product->is_batch ? $this->batch->expiration : null,
        ];
    }

    protected function calculateSubTotal()
    {
        $unit = Unit::find($this->purchase_unit_id);
        $quantity = $unit->operator == "/" ? (double) $this->quantity / $unit->operator_value : (double) $this->quantity * $unit->operator_value;

        $discounted_price = $this->discount_method == "0" ? $this->net_unit_cost - (double) $this->discount : $this->net_unit_cost * (1 - (double) $this->discount / 100);
        $taxed_price = $this->tax_method == "0" ? $discounted_price : $discounted_price * (1 + (double) $this->tax_rate / 100);

        return $quantity * $taxed_price;
    }



}
