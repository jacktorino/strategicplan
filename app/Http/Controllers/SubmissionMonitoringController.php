<?php

namespace App\Http\Controllers;

use App\Models\ReportingPeriod;
use App\Models\StrategicPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionMonitoringController extends Controller
{
    public function index(
        Request $request,
        StrategicPlan $strategicPlan
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | Reporting periods
        |--------------------------------------------------------------------------
        */

        $reportingPeriodId = $request->integer('reporting_period_id');

        $reportingPeriods = $strategicPlan
            ->reportingPeriods()
            ->orderBy('period_start')
            ->get([
                'id',
                'period_start',
                'period_end',
                'late_submission_start',
                'late_submission_end',
            ]);

        $reportingPeriod = $reportingPeriodId
            ? $reportingPeriods->firstWhere('id', $reportingPeriodId)
            : $reportingPeriods->first();

        if (! $reportingPeriod) {
            abort(404, 'No reporting period found.');
        }

        /*
        |--------------------------------------------------------------------------
        | Load strategic plan hierarchy
        |--------------------------------------------------------------------------
        */

        $strategicPlan->load([
            'kras.subKras.kpis.actionPlans.responsibleUnits',
            'kras.subKras.kpis.actionPlans.submissions.actionPlanUnit.organizationalUnit',
            'kras.subKras.kpis.actionPlans.submissions.submittedBy',
            'kras.subKras.kpis.actionPlans.submissions.attachments',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Build monitoring rows
        |--------------------------------------------------------------------------
        */

        $rows = collect();

        foreach ($strategicPlan->kras as $kra) {
            foreach ($kra->subKras as $subKra) {
                foreach ($subKra->kpis as $kpi) {
                    foreach ($kpi->actionPlans as $actionPlan) {
                        foreach ($actionPlan->responsibleUnits as $unit) {
                            $submission = $actionPlan->submissions
                                ->where(
                                    'reporting_period_id',
                                    $reportingPeriod->id
                                )
                                ->where(
                                    'action_plan_unit_id',
                                    $unit->pivot->id
                                )
                                ->first();

                            $rows->push([
                                'action_plan_id' => $actionPlan->id,

                                'action_plan_title' => $actionPlan->title,

                                'kpi' => [
                                    'id' => $kpi->id,
                                    'code' => $kpi->code,
                                    'name' => $kpi->name,
                                ],

                                'organizational_unit' => [
                                    'id' => $unit->id,
                                    'code' => $unit->code,
                                    'name' => $unit->name,
                                ],

                                'submitted' => $submission !== null,

                                'submission' => $submission
                                    ? [
                                        'id' => $submission->id,
                                        'status' => $submission->status,
                                        'timeliness' => $submission->timeliness,
                                        'comment' => $submission->comment,
                                        'submitted_at' => $submission->submitted_at,
                                        'submitted_by' => $submission->submittedBy?->name,
                                        'attachments_count' => $submission->attachments->count(),
                                    ]
                                    : null,
                            ]);
                        }
                    }
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Summary
        |--------------------------------------------------------------------------
        */

        $total = $rows->count();

        $submitted = $rows
            ->where('submitted', true)
            ->count();

        $pending = $total - $submitted;

        $onTime = $rows
            ->filter(function ($row) {
                return $row['submission'] !== null
                    && $row['submission']['timeliness'] === 'on_time';
            })
            ->count();

        $late = $rows
            ->filter(function ($row) {
                return $row['submission'] !== null
                    && $row['submission']['timeliness'] === 'late';
            })
            ->count();

        $progress = $total > 0
            ? round(($submitted / $total) * 100)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Inertia response
        |--------------------------------------------------------------------------
        */

        return Inertia::render('SubmissionMonitoring/Index', [
            'strategicPlan' => [
                'id' => $strategicPlan->id,
                'name' => $strategicPlan->name,
                'academic_year' => $strategicPlan->academic_year,
            ],

            'reportingPeriods' => $reportingPeriods,

            'reportingPeriod' => $reportingPeriod,

            'summary' => [
                'total' => $total,
                'submitted' => $submitted,
                'pending' => $pending,
                'on_time' => $onTime,
                'late' => $late,
                'progress' => $progress,
            ],

            'rows' => $rows->values(),
        ]);
    }
}

