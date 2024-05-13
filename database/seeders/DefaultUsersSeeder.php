<?php

namespace Database\Seeders;

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
            'email' => "super@admin.com",
            'password' => Hash::make('password'),
        ]);
        $superuser->assignRole('super_admin');
    }
}
