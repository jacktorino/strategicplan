<?php

namespace Database\Seeders;

use App\Models\StrategicPlan;
use Illuminate\Database\Seeder;

class StrategicPlanSeeder extends Seeder
{
    public function run(): void
    {
        StrategicPlan::create([
            'title' => 'University Strategic Development Plan',
            'school_year' => '2025-2030',
            'description' => 'Five-Year Strategic Plan',
            'status' => 'Active',
            'created_by' => 1,
        ]);
    }
}