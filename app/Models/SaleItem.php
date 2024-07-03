<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'sale_id',
        'product_id',
        'sale_unit_id',
        'net_unit_cost',
        'calculate_rate',
        'quantity',
        'discount_method',
        'discount',
        'tax_method',
        'tax_rate',
        'sub_total',
        'product_batch_id',
    ];
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function saleUnit()
    {
        return $this->belongsTo(Unit::class,'sale_unit_id','id');
    }


}
