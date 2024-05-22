<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Currency::create([
            'name' => "Indian Rupee",
            'short_name' => "INR",
            'symbol' => "₹"
        ]);

        Currency::create([
            'name' => "Dollar",
            'short_name' => "USD",
            'symbol' => "$"
        ]);
    }
}
