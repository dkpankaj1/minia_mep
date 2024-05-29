<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefaultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(FinanceYearSeeder::class);
        $this->call(CurrencySeeder::class);
        $this->call(UnitSeeder::class);
        $this->call(CompanySettingSeeder::class);
        $this->call(SystemSettingSeeder::class);
    }
}
