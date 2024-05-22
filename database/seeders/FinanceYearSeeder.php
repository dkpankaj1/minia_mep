<?php

namespace Database\Seeders;

use App\Models\FinanceYears;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinanceYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FinanceYears::create([
            'name' => "2023-2024",
            'start_date' => Carbon::today()->addDay(),
            'end_date' => Carbon::today()->addYear(),
        ]);
    }
}
