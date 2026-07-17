<?php

namespace Database\Seeders;

use App\Models\StrategicPlan;
use Illuminate\Database\Seeder;

class StrategicPlanSeeder extends Seeder
{
    public function run(): void
    {
        StrategicPlan::updateOrCreate(
            [
                'title' => 'University of the Visayas',
                'school_year' => '2026-2027',
            ],
            [
                'description' => null,
                'status' => 'Active',
                'created_by' => null,
            ]
        );
    }
}