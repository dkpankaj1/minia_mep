<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;
    protected $fillable = [
        "app_name",
        "logo",
        "favicon",
        'license',
        'default_currency',
    ];
    public function currency()
    {
        return $this->hasOne(Currency::class,'id','default_currency');
    }

}
