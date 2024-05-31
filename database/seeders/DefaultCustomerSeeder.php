<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefaultCustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $customerGroup = CustomerGroup::create([
            'name' =>"Default",
            'calculate_rate' => 0,
            'description' => "default customer group",
        ]);
        
        Customer::create(
            [
                'name' => "walk-in-customer ",
                'email' => "walk-in-customer@example.com",
                'phone' => "+91-1234567890",
                'whatsapp' => "+91-1234567890",
                'address' => "no address",
                'city' => "no city",
                'state' => "no state",
                'country' => "india",
                'postal_code' => "123456",
                'customer_group_id' => $customerGroup->id,
                'is_active' => true,
            ]
        );

    }
}
