<?php

namespace Database\Seeders;

use App\Models\Kra;
use App\Models\SubKra;
use Illuminate\Database\Seeder;

class SubKraSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            1 => [
                ['code' => '1.1', 'title' => 'Governance'],
                ['code' => '1.2', 'title' => 'Leadership'],
                ['code' => '1.3', 'title' => 'Human Resources Learning and Development'],
                ['code' => '1.4', 'title' => 'Communication'],
                ['code' => '1.5', 'title' => 'Physical Plant and Facilities'],
                ['code' => '1.6', 'title' => 'ICT'],
                ['code' => '1.7', 'title' => 'Finance'],
                ['code' => '1.8', 'title' => 'Accreditation & Certification'],
            ],
            2 => [
                ['code' => '2.1', 'title' => 'Research Production, Dissemination, Utilization'],
                ['code' => '2.2', 'title' => 'Knowledge Management'],
                ['code' => '2.3', 'title' => 'Library'],
            ],
            3 => [
                ['code' => '3.1', 'title' => 'Faculty'],
                ['code' => '3.2', 'title' => 'Instruction'],
                ['code' => '3.3', 'title' => 'Innovative Education'],
                ['code' => '3.4', 'title' => 'Employability'],
            ],
            4 => [
                ['code' => '4.1', 'title' => 'Community Extension'],
                ['code' => '4.2', 'title' => 'Philippine Linkages'],
                ['code' => '4.3', 'title' => 'International Linkages'],
            ],
            5 => [
                ['code' => '5.1', 'title' => 'PR and Marketing'],
                ['code' => '5.2', 'title' => 'Customer Feedback'],
                ['code' => '5.3', 'title' => 'Guidance & Counseling'],
                ['code' => '5.4', 'title' => 'Student Development & Discipline'],
                ['code' => '5.5', 'title' => 'Gender and Development Program'],
                ['code' => '5.6', 'title' => 'Sports Development'],
                ['code' => '5.7', 'title' => 'Arts & Culture Development'],
                ['code' => '5.8', 'title' => 'Alumni Relations'],
            ],
        ];

        foreach ($data as $kraNumber => $subAreas) {
            $kra = Kra::where('number', $kraNumber)->firstOrFail();

            foreach ($subAreas as $order => $subArea) {
                SubKra::updateOrCreate(
                    [
                        'kra_id' => $kra->id,
                        'code' => $subArea['code'],
                    ],
                    [
                        'title' => $subArea['title'],
                        'order_no' => $order + 1,
                    ]
                );
            }
        }
    }
}