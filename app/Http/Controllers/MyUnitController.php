<?php

namespace App\Http\Controllers;

use App\Models\ActionPlanSubmission;
use App\Models\ActionPlanUnit;
use App\Models\ReportingPeriod;
use App\Models\StrategicPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyUnitController extends Controller
{
    public function actionPlans(Request $request): Response
    {
        $user = $request->user();
        $unit = $user->organizationalUnit ?? $user->unit;

        $strategicPlan = StrategicPlan::with('reportingPeriods')->latest('start_date')->first();
        
        $reportingPeriods = $strategicPlan 
            ? $strategicPlan->reportingPeriods()->orderBy('period_start', 'desc')->get() 
            : collect();

        $reportingPeriod = $request->filled('reporting_period_id')
            ? $reportingPeriods->firstWhere('id', $request->reporting_period_id)
            : $reportingPeriods->first();

        $actionPlansQuery = ActionPlanUnit::with([
            'actionPlan.kpi.subKra.kra.strategicPlan',
            'submissions' => function ($query) use ($reportingPeriod) {
                if ($reportingPeriod) {
                    $query->where('reporting_period_id', $reportingPeriod->id);
                }
            }
        ]);

        if ($unit) {
            $actionPlansQuery->where('organizational_unit_id', $unit->id);
        }

        if ($strategicPlan) {
            $actionPlansQuery->whereHas('actionPlan.kpi.subKra.kra', function ($q) use ($strategicPlan) {
                $q->where('strategic_plan_id', $strategicPlan->id);
            });
        }

        $actionPlans = $actionPlansQuery->get()->map(function ($item) {
            $latestSubmission = $item->submissions->first();
            $kpi = $item->actionPlan->kpi ?? null;
            $subKra = $kpi?->subKra ?? null;
            $kra = $subKra?->kra ?? null;

            $kpiCode = implode('.', array_filter([$kra?->code, $subKra?->code, $kpi?->code]));

            return [
                'id' => $item->id,
                'action_plan_id' => $item->action_plan_id,
                'title' => $item->actionPlan->title ?? 'Untitled Plan',
                'description' => $item->actionPlan->description ?? null,
                'kpi_code' => $kpiCode ?: ($kpi?->code ?? 'N/A'),
                'kpi_name' => $kpi?->name ?? 'N/A',
                'status' => $latestSubmission ? $latestSubmission->status : 'pending',
                'submission_id' => $latestSubmission?->id,
                'submitted_at' => $latestSubmission?->submitted_at?->toIso8601String(),
            ];
        });

        return Inertia::render('my-unit/action-plans', [
            'unit' => $unit ? [
                'id' => $unit->id,
                'code' => $unit->code,
                'name' => $unit->name,
            ] : null,
            'strategicPlan' => $strategicPlan ? [
                'id' => $strategicPlan->id,
                'name' => $strategicPlan->name,
                'academic_year' => $strategicPlan->academic_year,
            ] : null,
            'reportingPeriod' => $reportingPeriod,
            'reportingPeriods' => $reportingPeriods,
            'actionPlans' => $actionPlans,
        ]);
    }

    public function submit(Request $request, ActionPlanUnit $actionPlanUnit): Response
    {
        $actionPlanUnit->loadMissing([
            'actionPlan.kpi.subKra.kra.strategicPlan',
            'organizationalUnit'
        ]);

        $kpi = $actionPlanUnit->actionPlan->kpi ?? null;
        $subKra = $kpi?->subKra ?? null;
        $kra = $subKra?->kra ?? null;
        $strategicPlan = $kra?->strategicPlan;

        $reportingPeriodId = $request->query('reporting_period_id');
        
        $reportingPeriod = $reportingPeriodId 
            ? ReportingPeriod::find($reportingPeriodId)
            : ($strategicPlan 
                ? ReportingPeriod::where('strategic_plan_id', $strategicPlan->id)->latest('period_start')->first() 
                : ReportingPeriod::latest('period_start')->first());

        $existingSubmission = null;
        if ($reportingPeriod) {
            $submission = ActionPlanSubmission::with('attachments')
                ->where('action_plan_unit_id', $actionPlanUnit->id)
                ->where('reporting_period_id', $reportingPeriod->id)
                ->first();

            if ($submission) {
                $existingSubmission = [
                    'id' => $submission->id,
                    'comment' => $submission->comment,
                    'status' => $submission->status,
                    'attachments' => $submission->attachments ? $submission->attachments->map(fn($att) => [
                        'id' => $att->id,
                        'original_name' => $att->original_name,
                        'download_url' => route('submission-attachments.download', $att->id),
                    ]) : [],
                ];
            }
        }

        $kpiCode = implode('.', array_filter([$kra?->code, $subKra?->code, $kpi?->code]));

        return Inertia::render('my-unit/submit', [
            'actionPlanUnit' => [
                'id' => $actionPlanUnit->id,
                'action_plan_id' => $actionPlanUnit->action_plan_id,
                'title' => $actionPlanUnit->actionPlan->title ?? 'Untitled Plan',
                'description' => $actionPlanUnit->actionPlan->description ?? null,
                'kpi_code' => $kpiCode ?: ($kpi?->code ?? 'N/A'),
                'kpi_name' => $kpi?->name ?? 'N/A',
            ],
            'reportingPeriod' => $reportingPeriod,
            'existingSubmission' => $existingSubmission,
        ]);
    }
}
