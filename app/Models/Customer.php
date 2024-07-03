<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory,SoftDeletes;
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
        return $this->belongsTo(CustomerGroup::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function scopeOfActive($query,$status)
    {
        return $query->where(
            'is_active',
            $status
        );
    }
}
