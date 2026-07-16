<?php

namespace Database\Seeders;

use App\Models\ResponsibleUnit;
use Illuminate\Database\Seeder;

class ResponsibleUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'name' => 'Information and Communications Technology Department',
                'acronym' => 'ICTD',
            ],
            [
                'name' => 'Quality Assurance Office',
                'acronym' => 'QAO',
            ],
            [
                'name' => 'Registrar Office',
                'acronym' => 'RO',
            ],
            [
                'name' => 'Research Office',
                'acronym' => 'RES',
            ],
            [
                'name' => 'Human Resource Office',
                'acronym' => 'HR',
            ],
        ];

        foreach ($units as $unit) {
            ResponsibleUnit::create($unit);
        }
    }
}