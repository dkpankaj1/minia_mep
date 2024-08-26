<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentPurchase extends Model
{
    use HasFactory;
    protected $fillable = [
        "date",
        "purchase_id",
        "amount",
        "transaction_id",
        "pmt_mode",
        "pmt_status",
        "note",
        "user_id",
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
