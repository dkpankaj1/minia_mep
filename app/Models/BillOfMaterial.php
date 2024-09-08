<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillOfMaterial extends Model
{
    use HasFactory;
    protected $fillable = [
        "code",
        "product_id",
        "overhead_cost",
        "other_cost",
        "notes",
        "status",
    ];

    public function scopeActive($query)
    {
        return $query->where(
            'status',
            1
        );
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function productionOrder()
    {
        return $this->hasMany(ProductionOrder::class);
    }
    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}
