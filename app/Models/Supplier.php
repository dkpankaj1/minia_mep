<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;
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
}
