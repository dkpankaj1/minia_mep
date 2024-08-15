<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductWarehouse extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'product_id',
        'warehouse_id',
        'quantity'
    ];

    protected $casts = [
        'product_id' => 'integer',
        'warehouse_id' => 'integer',
        'quantity' => 'double',
    ];

    public function batches()
    {
        return $this->hasMany(ProductBatch::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
    public function scopeWithPositiveQuantity($query)
    {
        return $query->where('quantity', '>', 0);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }


}
