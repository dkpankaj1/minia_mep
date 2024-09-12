<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        "name",
        "description",
    ];

    public function product()
    {
        return $this->hasMany(Product::class);
    }

    public function subCategory()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function getDescriptionAttribute($value)
    {
        return $value ?? 'Default description';
    }
}
