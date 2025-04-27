<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostProductionStock extends Model
{
    protected $fillable = [
        'stock_issue_id',
        'date',
        'status',
        'user_id',
    ];
}
