<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => "SuperAdmin",
            'email' => "super@gmail.com",
            'email_verified_at' => now(),
            'password' => bcrypt("12345678")
        ])->assignRole("SuperAdmin");

        User::create([
            'name' => "Admin",
            'email' => "admin@gmail.com",
            'email_verified_at' => now(),
            'password' => bcrypt("12345678")
        ])->assignRole("Admin");

        User::create([
            'name' => "User",
            'email' => "user@gmail.com",
            'email_verified_at' => now(),
            'password' => bcrypt("12345678")
        ])->assignRole("User");
    }
}
