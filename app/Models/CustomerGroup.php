<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerGroup extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        "name",
        "calculate_rate",
        "description",
    ];

    public function getDescriptionAttribute($value)
    {
        return $value ?? 'Default description';
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }


}
