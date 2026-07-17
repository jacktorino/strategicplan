<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('Testing123!'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Strategic Planner',
            'email' => 'st@example.com',
            'password' => Hash::make('Testing123!'),
            'role' => 'strategic_planner',
        ]);

      $subKra = \App\Models\SubKra::where('code', '1.6')->firstOrFail();

User::updateOrCreate(
    ['email' => 'ict@example.com'],
    [
        'name' => 'ICT',
        'password' => Hash::make('Testing123!'),
        'role' => 'key_result_area',
        'sub_kra_id' => $subKra->id,
    ]
);

        User::create([
            'name' => 'Viewer',
            'email' => 'viewer@example.com',
            'password' => Hash::make('Testing123!'),
            'role' => 'viewer',
        ]);
    }
}