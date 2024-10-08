<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $unit = Unit::create([
            'name' => "Kilogram",
            'short_name' => "KG",
            'operator' => "*",
            'operator_value' => 1,
            'base_unit' => null,
            'is_active' => 1
        ]);
        
        Unit::create([
            'name' => "Grams",
            'short_name' => "GM",
            'operator' => "/",
            'operator_value' => 1000,
            'base_unit' => $unit->id,
            'is_active' => 1
        ]);

        Unit::create([
            'name' => "Pies",
            'short_name' => "PC",
            'operator' => "*",
            'operator_value' => 1,
            'is_active' => 1
        ]);
    }
}
