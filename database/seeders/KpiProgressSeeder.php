<?php

namespace Database\Seeders;

use App\Models\Kpi;
use App\Models\KpiProgress;
use App\Models\User;
use Illuminate\Database\Seeder;

class KpiProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeds monthly progress records for every KPI, covering the months
     * that have already elapsed within the strategic plan's school year
     * (AY 2023-2026). Percentages trend upward month over month to
     * simulate realistic, gradually improving progress.
     */
    public function run(): void
    {
        $updaterId = User::query()->value('id') ?? 1;

        // (year, month) pairs to seed, in chronological order.
        // Adjust this range to match how far along the current AY is.
        $periods = [
            ['year' => 2023, 'month' => 9],
            ['year' => 2023, 'month' => 10],
            ['year' => 2023, 'month' => 11],
            ['year' => 2023, 'month' => 12],
            ['year' => 2024, 'month' => 1],
            ['year' => 2024, 'month' => 2],
            ['year' => 2024, 'month' => 3],
            ['year' => 2024, 'month' => 4],
            ['year' => 2024, 'month' => 5],
            ['year' => 2024, 'month' => 6],
        ];

        $created = 0;

        Kpi::query()->select(['id'])->chunkById(100, function ($kpis) use ($periods, $updaterId, &$created) {
            foreach ($kpis as $kpi) {
                $percentage = fake()->numberBetween(5, 20);

                foreach ($periods as $period) {
                    // Trend the percentage upward each month, with a little
                    // random noise, capped at 100.
                    $percentage = min(100, $percentage + fake()->numberBetween(3, 15));

                    KpiProgress::firstOrCreate(
                        [
                            'kpi_id' => $kpi->id,
                            'month' => $period['month'],
                            'year' => $period['year'],
                        ],
                        [
                            'percentage' => $percentage,
                            'remarks' => fake()->optional(0.3)->sentence(),
                            'updated_by' => $updaterId,
                        ],
                    );

                    $created++;
                }
            }
        });

        $this->command->info("KPI progress records seeded: {$created}");
    }
}