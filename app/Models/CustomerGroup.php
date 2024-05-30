<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerGroup extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "calculate_rate",
        "description",
    ];

    public function customers()
    {
        return $this->belongsTo(Customer::class);
    }
}
