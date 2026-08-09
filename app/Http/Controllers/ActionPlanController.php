<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\ReportingPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActionPlanController extends Controller
{
    public function show(
        Request $request,
        ActionPlan $actionPlan
    ): Response {
        $reportingPeriodId = $request->integer('reporting_period_id');

        $reportingPeriod = $reportingPeriodId
            ? ReportingPeriod::findOrFail($reportingPeriodId)
            : ReportingPeriod::whereHas(
                'strategicPlan.kras.subKras.kpis.actionPlans',
                fn ($query) => $query->whereKey($actionPlan->id)
            )
                ->whereDate('period_start', '<=', today())
                ->whereDate('period_end', '>=', today())
                ->first();

        if (! $reportingPeriod) {
            abort(404, 'No reporting period found.');
        }

        $strategicPlanId =
            $actionPlan->kpi->subKra->kra->strategic_plan_id;

        $reportingPeriods = ReportingPeriod::query()
            ->where('strategic_plan_id', $strategicPlanId)
            ->orderBy('period_start')
            ->get([
                'id',
                'period_start',
                'period_end',
                'late_submission_start',
                'late_submission_end',
            ]);

        $actionPlan->load([
            'kpi.subKra.kra.strategicPlan',
            'responsibleUnits',
            'submissions.actionPlanUnit.organizationalUnit',
            'submissions.submittedBy',
            'submissions.attachments',
        ]);

        $submissions = $actionPlan->submissions
            ->where('reporting_period_id', $reportingPeriod->id)
            ->keyBy('action_plan_unit_id');

        $responsibleUnits = $actionPlan->responsibleUnits
            ->map(function ($unit) use ($submissions) {
                $submission = $submissions->get(
                    $unit->pivot->id
                );

                return [
                    'id' => $unit->id,
                    'action_plan_unit_id' => $unit->pivot->id,
                    'code' => $unit->code,
                    'name' => $unit->name,
                    'submitted' => $submission !== null,

                    'submission' => $submission ? [
                        'id' => $submission->id,
                        'status' => $submission->status,
                        'timeliness' => $submission->timeliness,
                        'comment' => $submission->comment,
                        'submitted_at' => $submission->submitted_at,
                        'submitted_by' => $submission->submittedBy?->name,

                        'attachments' => $submission->attachments
                            ->map(fn ($attachment) => [
                                'id' => $attachment->id,
                                'original_name' =>
                                    $attachment->original_name,
                                'mime_type' =>
                                    $attachment->mime_type,
                                'size' => $attachment->size,
                                'download_url' => route(
                                    'submission-attachments.download',
                                    $attachment
                                ),
                            ])
                            ->values(),
                    ] : null,
                ];
            })
            ->values();

        return Inertia::render('ActionPlans/Show', [
            'actionPlan' => [
                'id' => $actionPlan->id,
                'title' => $actionPlan->title,
                'description' => $actionPlan->description,

                'kpi' => [
                    'id' => $actionPlan->kpi->id,
                    'code' => $actionPlan->kpi->code,
                    'name' => $actionPlan->kpi->name,
                ],

                'reporting_period' => [
                    'id' => $reportingPeriod->id,
                    'period_start' => $reportingPeriod->period_start,
                    'period_end' => $reportingPeriod->period_end,
                    'late_submission_start' =>
                        $reportingPeriod->late_submission_start,
                    'late_submission_end' =>
                        $reportingPeriod->late_submission_end,
                ],

                'reporting_periods' => $reportingPeriods,

                'progress' =>
                    $actionPlan->progressForPeriod($reportingPeriod),

                'responsible_units' => $responsibleUnits,
            ],
        ]);
    }
}

