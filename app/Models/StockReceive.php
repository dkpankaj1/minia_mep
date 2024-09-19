<?php

namespace App\Models;

use App\Enums\StockReceiveStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockReceive extends Model
{
    use HasFactory;
    protected $fillable = [
        "code",
        "date",
        "production_order_id",
        "unit_id",
        "quantity",
        "batch",
        "expiration",
        'product_batch_id',
        "status",
        "remark"
    ];
    protected $casts = [
        'status' => StockReceiveStatusEnum::class
    ];
    public function productBatch()
    {
        return $this->belongsTo(ProductBatch::class);
    }

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
