<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;
    protected $fillable = [
        "bill_of_material_id",
        "product_id",
        "unit_id",
        "quantity",
    ];

    public function billOfMaterial()
    {
        return $this->belongsTo(BillOfMaterial::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
