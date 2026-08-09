<?php

namespace Database\Seeders;

use App\Models\ActionPlan;
use App\Models\Kpi;
use App\Models\Kra;
use App\Models\OrganizationalUnit;
use App\Models\ReportingPeriod;
use App\Models\StrategicPlan;
use App\Models\SubKra;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class StrategicPlanSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            throw new \Exception(
                'No users found. Please create a user first.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Strategic Plan
        |--------------------------------------------------------------------------
        */

        $strategicPlan = StrategicPlan::updateOrCreate(
            [
                'name' => 'Strategic Plan 2026–2028',
            ],
            [
                'academic_year' => '2026–2028',
                'start_date' => '2026-01-01',
                'end_date' => '2028-12-31',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Organizational Units
        |--------------------------------------------------------------------------
        */

        $ict = OrganizationalUnit::updateOrCreate(
            ['code' => 'ICT'],
            [
                'name' => 'Information and Communications Technology',
                'parent_id' => null,
            ]
        );

        $hr = OrganizationalUnit::updateOrCreate(
            ['code' => 'HR'],
            [
                'name' => 'Human Resources',
                'parent_id' => null,
            ]
        );

        $finance = OrganizationalUnit::updateOrCreate(
            ['code' => 'FIN'],
            [
                'name' => 'Finance Office',
                'parent_id' => null,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | KRA 1
        |--------------------------------------------------------------------------
        */

        $kra1 = Kra::updateOrCreate(
            [
                'strategic_plan_id' => $strategicPlan->id,
                'code' => 'KRA-1',
            ],
            [
                'name' => 'Quality Education',
                'description' => 'Improve the quality and effectiveness of education.',
                'champion_id' => $user->id,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Sub-KRA 1.1
        |--------------------------------------------------------------------------
        */

        $subKra = SubKra::updateOrCreate(
            [
                'kra_id' => $kra1->id,
                'code' => 'SKRA-1.1',
            ],
            [
                'name' => 'Faculty Development',
                'description' => 'Strengthen faculty competencies and development.',
                'owner_id' => $user->id,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | KPI
        |--------------------------------------------------------------------------
        */

        $kpi = Kpi::updateOrCreate(
            [
                'sub_kra_id' => $subKra->id,
                'code' => 'KPI-1.1.1',
            ],
            [
                'name' => 'Faculty Development Compliance',
                'description' => 'Percentage of responsible units submitting their monthly compliance.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Action Plan
        |--------------------------------------------------------------------------
        */

        $actionPlan = ActionPlan::updateOrCreate(
            [
                'kpi_id' => $kpi->id,
                'title' => 'Conduct Faculty Development Activities',
            ],
            [
                'description' => 'Conduct and document faculty development activities.',
                'start_date' => '2026-01-01',
                'end_date' => '2028-12-31',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Responsible Units
        |--------------------------------------------------------------------------
        */

        $actionPlan->responsibleUnits()->sync([
            $ict->id,
            $hr->id,
            $finance->id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Reporting Periods
        |--------------------------------------------------------------------------
        */

        $this->createReportingPeriods($strategicPlan);
    }

    private function createReportingPeriods(
        StrategicPlan $strategicPlan
    ): void {
        $start = Carbon::parse($strategicPlan->start_date)
            ->startOfMonth();

        $end = Carbon::parse($strategicPlan->end_date)
            ->endOfMonth();

        while ($start->lessThanOrEqualTo($end)) {
            $periodStart = $start->copy()->startOfMonth();
            $periodEnd = $start->copy()->endOfMonth();

            $lateStart = $periodEnd->copy()
                ->addDay()
                ->startOfDay();

            $lateEnd = $lateStart->copy()
                ->addDays(5)
                ->endOfDay();

            ReportingPeriod::updateOrCreate(
                [
                    'strategic_plan_id' => $strategicPlan->id,
                    'period_start' => $periodStart,
                    'period_end' => $periodEnd,
                ],
                [
                    'late_submission_start' => $lateStart,
                    'late_submission_end' => $lateEnd,
                ]
            );

            $start->addMonth();
        }
    }
}
