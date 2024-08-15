<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductBatch extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_warehouse_id',
        'batch',
        'expiration',
        'quantity',
        'status'
    ];
    public function productWarehouse()
    {
        return $this->belongsTo(ProductWarehouse::class);
    }
    public function purchaseItem()
    {
        return $this->belongsTo(PurchaseItem::class);
    }
    public function scopeNotExpired($query)
    {
        return $query->where('expiration', '>=', Carbon::today());
    }
    public function scopeWithPositiveQuantity($query)
    {
        return $query->where('quantity', '>', 0);
    }
}
