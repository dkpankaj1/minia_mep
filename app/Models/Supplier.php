<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        "company",
        "name",
        "email",
        "phone",
        "whatsapp",
        "address",
        "city",
        "state",
        "country",
        "postal_code",
        "is_active",
    ];

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
}
