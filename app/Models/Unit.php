<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "short_name",
        "base_unit",
        "operator",
        "operator_value",
    ];

    public function baseUnit()
    {
        return $this->belongsTo(Unit::class,'base_unit','id');
    }
}
