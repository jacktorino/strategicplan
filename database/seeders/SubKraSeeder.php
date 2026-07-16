<?php

namespace Database\Seeders;

use App\Models\ResponsibleUnit;
use App\Models\SubKra;
use Illuminate\Database\Seeder;

class SubKraSeeder extends Seeder
{
    public function run(): void
    {
        SubKra::create([
            'kra_id' => 1,
            'responsible_unit_id' => ResponsibleUnit::where('acronym', 'ICTD')->first()->id,
            'code' => 'SKRA-1',
            'title' => 'Digital Learning Systems',
            'description' => 'Development of Digital Platforms',
            'order_no' => 1,
        ]);
    }
}