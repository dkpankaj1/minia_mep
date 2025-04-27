<?php

namespace Database\Seeders;

use App\Enums\DefaultB65ImageEnum;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superuser = User::create([
            'name' => "super admin",
            'email' => "superadmin@gmail.com",
            'password' => Hash::make('123456'),
            'phone' => fake()->phoneNumber,
            'address' => fake()->address,
            'city' => fake()->city,
            'state' => "Uttar Pradesh",
            'country' => "india",
            'postal_code' => "273001",
            'avatar' => DefaultB65ImageEnum::DEFAULT_USER_AVATAR,
            'is_active' => 1,
        ]);
        $superuser->assignRole('super_admin');
        $superuser->mySetting()->create([
            'user_id' => $superuser->id,
            'default_customer' => 1,
            'default_finance_year' => 1,
            'default_warehouse' => 1
        ]);
    }
}
