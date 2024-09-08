<?php

namespace App\Models;

use App\Enums\ProductionOrderEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        "date",
        "bill_of_material_id",
        "finance_year_id",
        "warehouse_id",
        "work_station_id",
        "quantity",
        "cost",
        "other_cost",
        "start_at",
        "end_at",
        "status",
        "user_id",

    ];

    protected $casts = [
        'status' => ProductionOrderEnum::class
    ];

    public function billOfMaterial()
    {
        return $this->belongsTo(BillOfMaterial::class);
    }
    public function financeYear()
    {
        return $this->belongsTo(FinanceYears::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
    public function workStation()
    {
        return $this->belongsTo(WorkStation::class);
    }
}
