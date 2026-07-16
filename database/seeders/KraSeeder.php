<?php

namespace Database\Seeders;

use App\Models\Kra;
use Illuminate\Database\Seeder;

class KraSeeder extends Seeder
{
    public function run(): void
    {
        Kra::create([
            'strategic_plan_id' => 1,
            'code' => 'KRA-1',
            'title' => 'Instruction',
            'description' => 'Quality Instruction',
            'order_no' => 1,
        ]);

        Kra::create([
            'strategic_plan_id' => 1,
            'code' => 'KRA-2',
            'title' => 'Research',
            'description' => 'Research Excellence',
            'order_no' => 2,
        ]);
    }
}