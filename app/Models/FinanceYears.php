<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceYears extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "start_date",
        "end_date"
    ];

    public function productionOrder()
    {
        return $this->hasMany(ProductionOrder::class);
    }
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
