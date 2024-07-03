<?php

namespace App\Models;

use Illuminate\Bus\Batch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'purchase_id',
        'product_id',
        'purchase_unit_id',
        'net_unit_cost',
        'quantity',
        'discount_method',
        'discount',
        'tax_method',
        'tax_rate',
        'total_tax',
        'sub_total',
        'product_batch_id'
    ];

    public function batch()
    {
        return $this->hasOne(ProductBatch::class,'id','product_batch_id');
    }
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function purchaseUnit()
    {
        return $this->belongsTo(Unit::class,'purchase_unit_id','id');
    }

}
