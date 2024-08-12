<?php

namespace App\Helpers;

use App\Models\MySetting;
use Illuminate\Support\Facades\Auth;


class MySettingHelper
{
    public static function getMySetting()
    {
        $currentUserId = Auth::user()->id;
        return MySetting::where('user_id', $currentUserId)->first();
    }
}

