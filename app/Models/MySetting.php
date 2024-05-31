<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MySetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'default_customer',
        'default_finance_year'
    ];

    public function defaultFinanceYear()
    {
        return $this->hasOne(FinanceYears::class, 'id', 'default_finance_year');
    }
    public function user()
    {
        return $this->hasOne(User::class);
    }
    public function defaultCustomer()
    {
        return $this->hasOne(Customer::class, 'id', 'default_customer');
    }
}
