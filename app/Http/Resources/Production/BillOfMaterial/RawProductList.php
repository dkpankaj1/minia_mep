<?php

namespace App\Http\Resources\Production\BillOfMaterial;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RawProductList extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'unit' => $this->unit,
            'cost' => $this->cost,
            'available_unit' => $this->getAvailableUnits()
        ];
    }
}
