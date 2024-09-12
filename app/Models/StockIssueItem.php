<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIssueItem extends Model
{
    use HasFactory;
    protected $fillable = [
        "stock_issue_id",
        "product_warehouse_id",
        "unit_id",
        "quantity",
        "batch",
    ];

    public function stockIssue()
    {
        return $this->belongsTo(StockIssue::class);
    }

    public function productWarehouse()
    {
        return $this->belongsTo(ProductWarehouse::class);
    }
    public function stockIssueItemBatches()
    {
        return $this->hasMany(StockIssueItemBatch::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
