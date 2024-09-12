<?php

namespace App\Models;

use App\Enums\StockIssueStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIssue extends Model
{
    use HasFactory;
    protected $fillable = [
        "code",
        "production_order_id",
        "date",
        "status",
        "user_id",
    ];

    protected $casts = [
        'status' => StockIssueStatusEnum::class
    ];

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class);
    }
    public function stockIssueItems()
    {
        return $this->hasMany(StockIssueItem::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
