<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SaleItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'sale_id',
        'product_warehouse_id',
        'product_batch_id',
        'sale_unit_id',
        'net_unit_price',
        'calculate_rate',
        'quantity',
        'discount_method',
        'discount',
        'tax_method',
        'tax_rate',
        'sub_total',
    ];
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function saleUnit()
    {
        return $this->belongsTo(Unit::class,'sale_unit_id','id');
    }
    
    public function batches()
    {
        return $this->hasMany(SaleItemBatch::class);
    }
    public function productWarehouse ()
    {
        return $this->belongsTo(ProductWarehouse::class);
    }

}
