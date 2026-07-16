<?php

namespace Database\Seeders;

use App\Models\ResponsibleUnit;
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
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Planning Officer',
            'email' => 'planning@example.com',
            'password' => Hash::make('password'),
            'role' => 'planning_officer',
        ]);

        User::create([
            'name' => 'ICT Responsible Unit',
            'email' => 'ict@example.com',
            'password' => Hash::make('password'),
            'role' => 'responsible_unit',
            'responsible_unit_id' => ResponsibleUnit::where('acronym', 'ICTD')->first()->id,
        ]);

        User::create([
            'name' => 'Viewer',
            'email' => 'viewer@example.com',
            'password' => Hash::make('password'),
            'role' => 'viewer',
        ]);
    }
}