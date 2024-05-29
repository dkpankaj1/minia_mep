<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MySetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'default_finance_year'
    ];

    public function financeYear()
    {
        return $this->hasOne(FinanceYears::class,'id','default_finance_year');
    }
    public function user()
    {
        return $this->hasOne(User::class);
    }
}
