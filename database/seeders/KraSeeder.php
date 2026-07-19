<?php

namespace Database\Seeders;

use App\Models\Kra;
use Illuminate\Database\Seeder;

class KraSeeder extends Seeder
{
    /**
     * KRAs are shared/global rows (one per `number`), not duplicated per
     * strategic plan — the `strategic_plan_id` column was dropped from
     * the `kras` table in the 2026_07_18_093532 migration. Match and
     * upsert on `number` alone.
     */
    public function run(): void
    {
        $kras = [
            [
                'number' => 1,
                'title' => 'Efficient and Effective Governance, Management and Leadership',
                'description' => 'Mission #4 and QO #4',
            ],
            [
                'number' => 2,
                'title' => 'Quality Research and Knowledge Management',
                'description' => 'Mission #1 and QO #3',
            ],
            [
                'number' => 3,
                'title' => 'Innovative and Excellent Teaching and Learning',
                'description' => 'Mission #2 and QO #2',
            ],
            [
                'number' => 4,
                'title' => 'Sustained Social Responsibility, Community Involvement and Industry Linkages',
                'description' => 'Mission #3 and QO #1',
            ],
            [
                'number' => 5,
                'title' => 'Holistic Engagement with Students and Other Stakeholders',
                'description' => 'Mission #4 and QO #5',
            ],
        ];

        foreach ($kras as $item) {
            Kra::updateOrCreate(
                [
                    'number' => $item['number'],
                ],
                [
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'order_no' => $item['number'],
                ]
            );
        }
    }
}
