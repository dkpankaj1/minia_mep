<?php

namespace Database\Seeders;

use App\Enums\DefaultB65ImageEnum;
use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            "name" => "Deoria Beveries Private Limited",
            "short_name" => "Deoria Beveries PVT.LTD.",
            "phone" => "8416888444",
            "email" => "example@email.com",
            "address" => "F-40 UPSIDC Industrial Area",
            "city" => "Deoria",
            "state" => "Uttar Pradesh",
            "country" => "india",
            "postal_code" => "274202",
            "logo" => DefaultB65ImageEnum::DEFAULT_LOGO
        ]);
    }
}
