<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        'date',
        'reference',
        'finance_year_id',
        'supplier_id',
        'warehouse_id',
        'discount_method',
        'discount',
        'total_tax',
        'tax_rate',
        'total_cost',
        'shipping_cost',
        'other_cost',
        'grand_total',
        'paid_amount',
        'order_status',
        'payment_status',
        'note',
        'user_id',
    ];

    public function financeYear()
    {
        return $this->belongsTo(FinanceYears::class);
    }
    public function payments()
    {
        return $this->hasMany(PaymentPurchase::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
