<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'is_active'
    ];



    public function productWarehouse()
    {
        return $this->hasMany(ProductWarehouse::class);
    }
    public function productionOrder()
    {
        return $this->hasMany(ProductionOrder::class);
    }
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
