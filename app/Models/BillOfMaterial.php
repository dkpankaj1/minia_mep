<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillOfMaterial extends Model
{
    use HasFactory;
    protected $fillable = [
        "product_id",
        "overhead_cost",
        "other_cost",
        "notes",
        "status",
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}
