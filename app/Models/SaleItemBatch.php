<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItemBatch extends Model
{
    use HasFactory;
    protected $fillable = [
        'sale_item_id',
        'product_batch_id',
        'quantity',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'double',
        ];
    }

    public function saleItem()
    {
        return $this->belongsTo(SaleItem::class);
    }
}
