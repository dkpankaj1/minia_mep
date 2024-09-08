<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkStation extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "status",
        "description",
    ];

    public function scopeActive($query)
    {
        return $query->where(
            'status',
            1
        );
    }

    public function productionOrder()
    {
        return $this->hasMany(ProductionOrder::class);
    }
}
