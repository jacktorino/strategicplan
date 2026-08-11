<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Roles & Permissions FIRST
        $this->call(RoleAndPermissionSeeder::class);

        // 2. Create Jack Torino SECOND
        $user = User::factory()->create([
            'name' => 'Jack Torino',
            'email' => 'jack@example.com',
        ]);
        $user->assignRole('admin');

        // 3. Create Strategic Plans THIRD (uses Jack as the owner)
        $this->call(StrategicPlanSeeder::class);
    }
}