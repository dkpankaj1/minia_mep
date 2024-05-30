<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "email",
        "phone",
        "whatsapp",
        "address",
        "city",
        "state",
        "country",
        "postal_code",
        "customer_group_id",
        "is_active",
    ];

    public function customerGroup()
    {
        return $this->hasOne(CustomerGroup::class);
    }
}
