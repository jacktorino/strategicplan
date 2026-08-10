<?php

namespace App\Http\Controllers;

use App\Models\StrategicPlan;
use Inertia\Inertia;
use Inertia\Response;

class StrategicPlanDashboardController extends Controller
{
    public function show(StrategicPlan $strategicPlan): Response
    {
        $strategicPlan->load([
            'reportingPeriods',

            'kras.subKras.kpis.actionPlans.responsibleUnits',

            'kras.subKras.kpis.actionPlans.submissions',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Overall statistics
        |--------------------------------------------------------------------------
        |
        | Expected submission =
        | Action Plan × Responsible Unit × Reporting Period
        |
        */

        $totalExpected = 0;
        $totalSubmitted = 0;
        $totalOnTime = 0;
        $totalLate = 0;

        /*
        |--------------------------------------------------------------------------
        | KRA statistics
        |--------------------------------------------------------------------------
        */

        $kraData = $strategicPlan->kras->map(function ($kra) use (
            $strategicPlan,
            &$totalExpected,
            &$totalSubmitted,
            &$totalOnTime,
            &$totalLate
        ) {
            $expected = 0;
            $submitted = 0;
            $onTime = 0;
            $late = 0;

            foreach ($kra->subKras as $subKra) {
                foreach ($subKra->kpis as $kpi) {
                    foreach ($kpi->actionPlans as $actionPlan) {

                        foreach ($actionPlan->responsibleUnits as $unit) {

                            foreach ($strategicPlan->reportingPeriods as $period) {

                                $expected++;

                                $submission = $actionPlan->submissions
                                    ->where(
                                        'action_plan_unit_id',
                                        $unit->pivot->id
                                    )
                                    ->where(
                                        'reporting_period_id',
                                        $period->id
                                    )
                                    ->first();

                                if ($submission) {
                                    $submitted++;

                                    if ($submission->timeliness === 'on_time') {
                                        $onTime++;
                                    }

                                    if ($submission->timeliness === 'late') {
                                        $late++;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            $pending = $expected - $submitted;

            $progress = $expected > 0
                ? round(($submitted / $expected) * 100)
                : 0;

            $totalExpected += $expected;
            $totalSubmitted += $submitted;
            $totalOnTime += $onTime;
            $totalLate += $late;

            return [
                'id' => $kra->id,
                'code' => $kra->code,
                'name' => $kra->name,

                'expected' => $expected,
                'submitted' => $submitted,
                'pending' => $pending,

                'on_time' => $onTime,
                'late' => $late,

                'progress' => $progress,
            ];
        })->values();

        /*
        |--------------------------------------------------------------------------
        | KPI statistics
        |--------------------------------------------------------------------------
        */

        $kpiData = collect();

        foreach ($strategicPlan->kras as $kra) {
            foreach ($kra->subKras as $subKra) {
                foreach ($subKra->kpis as $kpi) {

                    $expected = 0;
                    $submitted = 0;
                    $onTime = 0;
                    $late = 0;

                    foreach ($kpi->actionPlans as $actionPlan) {

                        foreach ($actionPlan->responsibleUnits as $unit) {

                            foreach ($strategicPlan->reportingPeriods as $period) {

                                $expected++;

                                $submission = $actionPlan->submissions
                                    ->where(
                                        'action_plan_unit_id',
                                        $unit->pivot->id
                                    )
                                    ->where(
                                        'reporting_period_id',
                                        $period->id
                                    )
                                    ->first();

                                if ($submission) {
                                    $submitted++;

                                    if ($submission->timeliness === 'on_time') {
                                        $onTime++;
                                    }

                                    if ($submission->timeliness === 'late') {
                                        $late++;
                                    }
                                }
                            }
                        }
                    }

                    $pending = $expected - $submitted;

                    $progress = $expected > 0
                        ? round(($submitted / $expected) * 100)
                        : 0;

                    $kpiData->push([
                        'id' => $kpi->id,
                        'code' => $kpi->code,
                        'name' => $kpi->name,

                        'expected' => $expected,
                        'submitted' => $submitted,
                        'pending' => $pending,

                        'on_time' => $onTime,
                        'late' => $late,

                        'progress' => $progress,
                    ]);
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Organizational Unit performance
        |--------------------------------------------------------------------------
        */

        $unitData = collect();

        foreach ($strategicPlan->kras as $kra) {
            foreach ($kra->subKras as $subKra) {
                foreach ($subKra->kpis as $kpi) {
                    foreach ($kpi->actionPlans as $actionPlan) {

                        foreach ($actionPlan->responsibleUnits as $unit) {

                            $unitId = $unit->id;

                            if (! $unitData->has($unitId)) {
                                $unitData->put($unitId, [
                                    'id' => $unit->id,
                                    'code' => $unit->code,
                                    'name' => $unit->name,

                                    'expected' => 0,
                                    'submitted' => 0,
                                    'pending' => 0,

                                    'on_time' => 0,
                                    'late' => 0,
                                ]);
                            }

                            $data = $unitData->get($unitId);

                            foreach ($strategicPlan->reportingPeriods as $period) {

                                $data['expected']++;

                                $submission = $actionPlan->submissions
                                    ->where(
                                        'action_plan_unit_id',
                                        $unit->pivot->id
                                    )
                                    ->where(
                                        'reporting_period_id',
                                        $period->id
                                    )
                                    ->first();

                                if ($submission) {
                                    $data['submitted']++;

                                    if ($submission->timeliness === 'on_time') {
                                        $data['on_time']++;
                                    }

                                    if ($submission->timeliness === 'late') {
                                        $data['late']++;
                                    }
                                }
                            }

                            $unitData->put($unitId, $data);
                        }
                    }
                }
            }
        }

        $unitData = $unitData
            ->map(function ($unit) {

                $unit['pending'] =
                    $unit['expected'] - $unit['submitted'];

                $unit['progress'] =
                    $unit['expected'] > 0
                        ? round(
                            ($unit['submitted'] / $unit['expected']) * 100
                        )
                        : 0;

                return $unit;
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Reporting Period statistics
        |--------------------------------------------------------------------------
        */

        $periodData = $strategicPlan->reportingPeriods
            ->map(function ($period) use ($strategicPlan) {

                $expected = 0;
                $submitted = 0;
                $onTime = 0;
                $late = 0;

                foreach ($strategicPlan->kras as $kra) {
                    foreach ($kra->subKras as $subKra) {
                        foreach ($subKra->kpis as $kpi) {
                            foreach ($kpi->actionPlans as $actionPlan) {

                                foreach ($actionPlan->responsibleUnits as $unit) {

                                    $expected++;

                                    $submission = $actionPlan->submissions
                                        ->where(
                                            'action_plan_unit_id',
                                            $unit->pivot->id
                                        )
                                        ->where(
                                            'reporting_period_id',
                                            $period->id
                                        )
                                        ->first();

                                    if ($submission) {
                                        $submitted++;

                                        if ($submission->timeliness === 'on_time') {
                                            $onTime++;
                                        }

                                        if ($submission->timeliness === 'late') {
                                            $late++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                $pending = $expected - $submitted;

                $progress = $expected > 0
                    ? round(($submitted / $expected) * 100)
                    : 0;

                return [
                    'id' => $period->id,
                    'period_start' => $period->period_start,
                    'period_end' => $period->period_end,

                    'expected' => $expected,
                    'submitted' => $submitted,
                    'pending' => $pending,

                    'on_time' => $onTime,
                    'late' => $late,

                    'progress' => $progress,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Overall progress
        |--------------------------------------------------------------------------
        */

        $overallPending =
            $totalExpected - $totalSubmitted;

        $overallProgress = $totalExpected > 0
            ? round(
                ($totalSubmitted / $totalExpected) * 100
            )
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        return Inertia::render('StrategicPlans/Dashboard', [

            'strategicPlan' => [
                'id' => $strategicPlan->id,
                'name' => $strategicPlan->name,
                'academic_year' => $strategicPlan->academic_year,
                'start_date' => $strategicPlan->start_date,
                'end_date' => $strategicPlan->end_date,
            ],

            'summary' => [

                'total_kras' =>
                    $strategicPlan->kras->count(),

                'total_kpis' =>
                    $kpiData->count(),

                'total_action_plans' =>
                    $strategicPlan
                        ->kras
                        ->flatMap(
                            fn ($kra) =>
                                $kra->subKras
                                    ->flatMap(
                                        fn ($subKra) =>
                                            $subKra->kpis
                                                ->flatMap(
                                                    fn ($kpi) =>
                                                        $kpi->actionPlans
                                                )
                                    )
                        )
                        ->count(),

                'expected_submissions' =>
                    $totalExpected,

                'submitted_submissions' =>
                    $totalSubmitted,

                'pending_submissions' =>
                    $overallPending,

                'on_time_submissions' =>
                    $totalOnTime,

                'late_submissions' =>
                    $totalLate,

                'overall_progress' =>
                    $overallProgress,
            ],

            'kras' => $kraData,

            'kpis' => $kpiData,

            'units' => $unitData,

            'periods' => $periodData,
        ]);
    }
}

