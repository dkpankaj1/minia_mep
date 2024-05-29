<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class DefaultSupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supplier::create([
            "company" => "Direct Company",
            "name" => "Direct Supplier",
            "email" => "directSupplier@email.com",
            "phone" => fake()->phoneNumber,
            "whatsapp" => fake()->phoneNumber,
            "address" => "No Address",
            "city" => "No City",
            "state" => "No State",
            "country" => "India",
            "postal_code" => fake()->postcode,
            "is_active" => 1,
        ]);
    }
}
