<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;
    protected $fillable = [
        'invoice_id',
        'date',
        'customer_id',
        'finance_year_id',
        'warehouse_id',
        'total_cost',
        'discount_method',
        'discount',
        'total_tax',
        'tax_rate',
        'shipping_cost',
        'other_cost',
        'grand_total',
        'paid_amount',
        'order_status',
        'payment_status',
        'note',
        'user_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function financeYear()
    {
        return $this->belongsTo(FinanceYears::class);
    }
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
