<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostProductionStockItem extends Model
{
    protected $fillable = [
        'post_production_stock_id',
        'stock_issue_item_id',
        'unit_id',
        'quantity',
        'batch',
    ];
}
