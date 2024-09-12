<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIssueItemBatch extends Model
{
    use HasFactory;
    protected $fillable = [
        "stock_issue_item_id",
        "product_batch_id",
        "quantity",
    ];

    public function stockIssueItem()
    {
        return $this->belongsTo(StockIssueItem::class);
    }
    public function productBatch()
    {
        return $this->belongsTo(ProductBatch::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
