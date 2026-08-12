<?php

namespace App\Http\Controllers;

use App\Models\ActionPlanSubmission;
use App\Models\ActionPlanUnit;
use App\Models\OrganizationalUnit;
use App\Models\ReportingPeriod;
use App\Models\StrategicPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyUnitController extends Controller
{
    /**
     * Display assigned action plans for the current user's unit.
     */
  public function actionPlans(Request $request): Response
{
    $user = $request->user();

    // 1. Resolve user's unit from the many-to-many relationship (prioritizing primary if available)
    $unit = $user->organizationalUnits()->wherePivot('is_primary', true)->first()
        ?? $user->organizationalUnits()->first();

    if (!$unit) {
        return Inertia::render('my-unit/action-plans', [
            'unit' => null,
            'strategicPlan' => null,
            'reportingPeriod' => null,
            'reportingPeriods' => [],
            'actionPlans' => [],
        ]);
    }

    // 2. Fetch Strategic Plan & Reporting Periods
    $strategicPlan = StrategicPlan::latest('start_date')->first();
    $reportingPeriods = ReportingPeriod::orderBy('period_start', 'desc')->get();

    $reportingPeriod = $request->filled('reporting_period_id')
        ? $reportingPeriods->firstWhere('id', $request->reporting_period_id)
        : ($reportingPeriods->firstWhere('is_active', true) ?? $reportingPeriods->first());

    // 3. Fetch ActionPlanUnits assigned to this unit
    $assignedUnits = ActionPlanUnit::where('organizational_unit_id', $unit->id)
        ->with([
            'actionPlan.kpi.subKra.kra',
            'submissions' => function ($query) use ($reportingPeriod) {
                if ($reportingPeriod) {
                    $query->where('reporting_period_id', $reportingPeriod->id);
                }
                $query->latest('id');
            }
        ])
        ->get();

    // 4. Map cleanly for frontend
    $actionPlans = $assignedUnits
        ->unique('action_plan_id')
        ->map(function ($item) {
            $actionPlan = $item->actionPlan;
            $latestSubmission = $item->submissions->first();

            $kpi = $actionPlan?->kpi;
            $subKra = $kpi?->subKra;
            $kra = $subKra?->kra;

            return [
                'id' => $item->id,
                'action_plan_id' => $item->action_plan_id,
                'kra_code' => $kra?->code ?? 'KRA',
                'kra_name' => $kra?->name ?? 'General Objectives',
                'sub_kra_code' => $subKra?->code ?? '',
                'sub_kra_name' => $subKra?->name ?? 'General',
                'kpi_code' => $kpi?->code ?? 'KPI',
                'kpi_name' => $kpi?->name ?? 'General Indicator',
                'title' => $actionPlan?->title ?? 'Untitled Plan',
                'description' => $actionPlan?->description ?? null,
                'status' => $latestSubmission ? $latestSubmission->status : 'pending',
                'submission_id' => $latestSubmission?->id,
                'submitted_at' => $latestSubmission?->submitted_at?->toIso8601String(),
            ];
        })
        ->values();

    return Inertia::render('my-unit/action-plans', [
        'unit' => [
            'id' => $unit->id,
            'code' => $unit->code,
            'name' => $unit->name,
        ],
        'strategicPlan' => $strategicPlan ? [
            'id' => $strategicPlan->id,
            'name' => $strategicPlan->name,
            'academic_year' => $strategicPlan->academic_year ?? 'N/A',
        ] : null,
        'reportingPeriod' => $reportingPeriod,
        'reportingPeriods' => $reportingPeriods,
        'actionPlans' => $actionPlans,
    ]);
}
}