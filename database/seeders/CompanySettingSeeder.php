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
            "name" => "Company Name Privet Limited",
            "short_name" => "CM PVT.LTD.",
            "phone" => "9794445940",
            "email" => "example@email.com",
            "address" => "company address",
            "city" => " city name",
            "state" => "state name",
            "country" => "india",
            "postal_code" => "273001",
            "logo" => DefaultB65ImageEnum::DEFAULT_LOGO
        ]);
    }
}
