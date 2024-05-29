<?php

namespace Database\Seeders;

use App\Enums\DefaultB65ImageEnum;
use App\Models\SystemSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SystemSetting::create([
            "app_name" => "Minia Admin",
            "logo" => DefaultB65ImageEnum::DEFAULT_LOGO,
            "favicon" => DefaultB65ImageEnum::DEFAULT_LOGO,
            'license' => "bWluaWFfYWRtaW5fbGljZW5jZQ==",
            'default_currency' => 1
        ]);
    }
}
