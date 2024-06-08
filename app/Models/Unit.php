<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        "name",
        "short_name",
        "base_unit",
        "operator",
        "operator_value",
        "is_active"
    ];

    public function baseUnit()
    {
        return $this->belongsTo(Unit::class, 'base_unit', 'id');
    }
    public function subUnits()
    {
        return $this->hasMany(Unit::class, 'base_unit', 'id');
    }
    public function scopeActive($query)
    {
        return $query->where(
            'is_active',
            true
        );
    }

}
