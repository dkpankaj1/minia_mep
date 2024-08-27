<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentSale extends Model
{
    use HasFactory;
    protected $fillable = [
        "date",
        "sale_id",
        "amount",
        "transaction_id",
        "pmt_mode",
        "pmt_status",
        "note",
        "user_id",
    ];
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
