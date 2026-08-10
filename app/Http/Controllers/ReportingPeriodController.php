<?php

namespace App\Http\Controllers;

use App\Models\ReportingPeriod;
use App\Models\StrategicPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportingPeriodController extends Controller
{
    /**
     * Display all reporting periods for a strategic plan.
     */
    public function index(
        StrategicPlan $strategicPlan
    ): Response {
        $reportingPeriods = $strategicPlan->reportingPeriods()
            ->orderBy('period_start')
            ->get([
                'id',
                'strategic_plan_id',
                'period_start',
                'period_end',
                'late_submission_start',
                'late_submission_end',
            ])
            ->map(function (ReportingPeriod $period) {
                return [
                    'id' => $period->id,
                    'period_start' => $period->period_start,
                    'period_end' => $period->period_end,
                    'late_submission_start' => $period->late_submission_start,
                    'late_submission_end' => $period->late_submission_end,
                    'status' => $this->getStatus($period),
                ];
            });

        return Inertia::render('ReportingPeriods/Index', [
            'strategicPlan' => [
                'id' => $strategicPlan->id,
                'name' => $strategicPlan->name,
                'academic_year' => $strategicPlan->academic_year,
            ],
            'reportingPeriods' => $reportingPeriods,
        ]);
    }

    /**
     * Show the create form.
     */
    public function create(
        StrategicPlan $strategicPlan
    ): Response {
        return Inertia::render('ReportingPeriods/Create', [
            'strategicPlan' => [
                'id' => $strategicPlan->id,
                'name' => $strategicPlan->name,
                'academic_year' => $strategicPlan->academic_year,
            ],
        ]);
    }

    /**
     * Store a new reporting period.
     */
    public function store(
        Request $request,
        StrategicPlan $strategicPlan
    ): RedirectResponse {
        $validated = $request->validate([
            'period_start' => [
                'required',
                'date',
            ],

            'period_end' => [
                'required',
                'date',
                'after_or_equal:period_start',
            ],

            'late_submission_start' => [
                'required',
                'date',
                'after:period_end',
            ],

            'late_submission_end' => [
                'required',
                'date',
                'after_or_equal:late_submission_start',
            ],
        ]);

        $strategicPlan->reportingPeriods()->create($validated);

        return redirect()
            ->route('reporting-periods.index', $strategicPlan)
            ->with('success', 'Reporting period created successfully.');
    }

    /**
     * Show the edit form.
     */
    public function edit(
        StrategicPlan $strategicPlan,
        ReportingPeriod $reportingPeriod
    ): Response {
        $this->ensureBelongsToStrategicPlan(
            $reportingPeriod,
            $strategicPlan
        );

        return Inertia::render('ReportingPeriods/Edit', [
            'strategicPlan' => [
                'id' => $strategicPlan->id,
                'name' => $strategicPlan->name,
                'academic_year' => $strategicPlan->academic_year,
            ],

            'reportingPeriod' => [
                'id' => $reportingPeriod->id,
                'period_start' => $reportingPeriod->period_start,
                'period_end' => $reportingPeriod->period_end,
                'late_submission_start' =>
                    $reportingPeriod->late_submission_start,
                'late_submission_end' =>
                    $reportingPeriod->late_submission_end,
            ],
        ]);
    }

    /**
     * Update an existing reporting period.
     */
    public function update(
        Request $request,
        StrategicPlan $strategicPlan,
        ReportingPeriod $reportingPeriod
    ): RedirectResponse {
        $this->ensureBelongsToStrategicPlan(
            $reportingPeriod,
            $strategicPlan
        );

        $validated = $request->validate([
            'period_start' => [
                'required',
                'date',
            ],

            'period_end' => [
                'required',
                'date',
                'after_or_equal:period_start',
            ],

            'late_submission_start' => [
                'required',
                'date',
                'after:period_end',
            ],

            'late_submission_end' => [
                'required',
                'date',
                'after_or_equal:late_submission_start',
            ],
        ]);

        $reportingPeriod->update($validated);

        return redirect()
            ->route('reporting-periods.index', $strategicPlan)
            ->with('success', 'Reporting period updated successfully.');
    }

    /**
     * Delete a reporting period.
     */
    public function destroy(
        StrategicPlan $strategicPlan,
        ReportingPeriod $reportingPeriod
    ): RedirectResponse {
        $this->ensureBelongsToStrategicPlan(
            $reportingPeriod,
            $strategicPlan
        );

        $reportingPeriod->delete();

        return redirect()
            ->route('reporting-periods.index', $strategicPlan)
            ->with('success', 'Reporting period deleted successfully.');
    }

    /**
     * Determine the current status of a reporting period.
     */
    private function getStatus(
        ReportingPeriod $period
    ): string {
        $now = now();

        if (
            $now->between(
                $period->period_start,
                $period->period_end
            )
        ) {
            return 'open';
        }

        if (
            $now->between(
                $period->late_submission_start,
                $period->late_submission_end
            )
        ) {
            return 'late';
        }

        if ($now->lt($period->period_start)) {
            return 'upcoming';
        }

        return 'closed';
    }

    /**
     * Make sure the reporting period belongs to this strategic plan.
     */
    private function ensureBelongsToStrategicPlan(
        ReportingPeriod $reportingPeriod,
        StrategicPlan $strategicPlan
    ): void {
        if (
            $reportingPeriod->strategic_plan_id !==
            $strategicPlan->id
        ) {
            abort(404);
        }
    }
}

