<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionsSeeder::class);
        $this->call(DefaultRoleSeeder::class);
        $this->call(DefaultUsersSeeder::class);
        $this->call(CurrencySeeder::class);
        $this->call(UnitSeeder::class);
        $this->call(FinanceYearSeeder::class);
    }
}
