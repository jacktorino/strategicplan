<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\Kpi;
use App\Models\OrganizationalUnit;
use App\Models\ReportingPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActionPlanController extends Controller
{
    /**
     * Display a listing of action plans.
     */
    public function index(Request $request): Response
    {
        $actionPlans = ActionPlan::query()
            ->with(['kpi:id,code,name'])
            ->withCount('responsibleUnits as units_count')
            ->latest('id')
            ->paginate(15);

        $kpis = Kpi::query()
            ->orderBy('code')
            ->get(['id', 'code', 'name']);

        return Inertia::render('my-sub-kra/action-plans', [
            'actionPlans' => $actionPlans,
            'kpis' => $kpis,
        ]);
    }

    public function create(Kpi $kpi): Response
    {
        $kpi->load('subKra.kra.strategicPlan');

        $organizationalUnits = OrganizationalUnit::query()
            ->orderBy('name')
            ->get([
                'id',
                'code',
                'name',
            ]);

        return Inertia::render('my-sub-kra/action-plans-create', [
            'kpi' => [
                'id' => $kpi->id,
                'code' => $kpi->code,
                'name' => $kpi->name,
                'sub_kra' => [
                    'id' => $kpi->subKra->id,
                    'code' => $kpi->subKra->code,
                    'name' => $kpi->subKra->name,
                ],
                'strategic_plan' => [
                    'id' => $kpi->subKra->kra->strategicPlan->id,
                    'name' => $kpi->subKra->kra->strategicPlan->name,
                ],
            ],
            'organizationalUnits' => $organizationalUnits,
        ]);
    }

    public function store(
        Request $request,
        Kpi $kpi
    ): RedirectResponse {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'organizational_unit_ids' => [
                'nullable',
                'array',
            ],
            'organizational_unit_ids.*' => [
                'integer',
                'exists:organizational_units,id',
            ],
        ]);

        $actionPlan = $kpi->actionPlans()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        $actionPlan->responsibleUnits()->sync(
            $validated['organizational_unit_ids'] ?? []
        );

        return redirect()
            ->route('my-sub-kra.action-plans')
            ->with('success', 'Action Plan created successfully.');
    }

    public function edit(
        Kpi $kpi,
        ActionPlan $actionPlan
    ): Response {
        abort_unless(
            $actionPlan->kpi_id === $kpi->id,
            404
        );

        $kpi->load('subKra.kra.strategicPlan');
        $actionPlan->load('responsibleUnits');

        $organizationalUnits = OrganizationalUnit::query()
            ->orderBy('name')
            ->get([
                'id',
                'code',
                'name',
            ]);

        return Inertia::render('my-sub-kra/action-plans-edit', [
            'kpi' => [
                'id' => $kpi->id,
                'code' => $kpi->code,
                'name' => $kpi->name,
                'sub_kra' => [
                    'id' => $kpi->subKra->id,
                    'code' => $kpi->subKra->code,
                    'name' => $kpi->subKra->name,
                ],
                'strategic_plan' => [
                    'id' => $kpi->subKra->kra->strategicPlan->id,
                    'name' => $kpi->subKra->kra->strategicPlan->name,
                ],
            ],
            'actionPlan' => [
                'id' => $actionPlan->id,
                'title' => $actionPlan->title,
                'description' => $actionPlan->description,
                'organizational_unit_ids' =>
                    $actionPlan->responsibleUnits
                        ->pluck('id')
                        ->values(),
            ],
            'organizationalUnits' => $organizationalUnits,
        ]);
    }

    public function update(
        Request $request,
        Kpi $kpi,
        ActionPlan $actionPlan
    ): RedirectResponse {
        abort_unless(
            $actionPlan->kpi_id === $kpi->id,
            404
        );

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'organizational_unit_ids' => [
                'nullable',
                'array',
            ],
            'organizational_unit_ids.*' => [
                'integer',
                'exists:organizational_units,id',
            ],
        ]);

        $actionPlan->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        $actionPlan->responsibleUnits()->sync(
            $validated['organizational_unit_ids'] ?? []
        );

        return redirect()
            ->route('my-sub-kra.action-plans')
            ->with('success', 'Action Plan updated successfully.');
    }

    public function destroy(
        Kpi $kpi,
        ActionPlan $actionPlan
    ): RedirectResponse {
        abort_unless(
            $actionPlan->kpi_id === $kpi->id,
            404
        );

        $actionPlan->delete();

        return redirect()
            ->route('my-sub-kra.action-plans')
            ->with('success', 'Action Plan deleted successfully.');
    }

    public function show(
        Request $request,
        ActionPlan $actionPlan
    ): Response {
        $reportingPeriodId = $request->integer('reporting_period_id');

        $reportingPeriod = $reportingPeriodId
            ? ReportingPeriod::find($reportingPeriodId)
            : ReportingPeriod::whereHas(
                'strategicPlan.kras.subKras.kpis.actionPlans',
                fn ($query) => $query->whereKey($actionPlan->id)
            )
                ->whereDate('period_start', '<=', today())
                ->whereDate('period_end', '>=', today())
                ->first();

        if (! $reportingPeriod) {
            $reportingPeriod = ReportingPeriod::latest('period_start')->first();
        }

        $strategicPlanId =
            $actionPlan->kpi->subKra->kra->strategic_plan_id ?? null;

        $reportingPeriods = ReportingPeriod::query()
            ->when($strategicPlanId, fn ($q) => $q->where('strategic_plan_id', $strategicPlanId))
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
            ? $actionPlan->submissions->where('reporting_period_id', $reportingPeriod?->id)->keyBy('action_plan_unit_id')
            : collect();

        $responsibleUnits = $actionPlan->responsibleUnits
            ->map(function ($unit) use ($submissions) {
                $submission = $submissions->get(
                    $unit->pivot->id ?? null
                );

                return [
                    'id' => $unit->id,
                    'action_plan_unit_id' => $unit->pivot->id ?? null,
                    'code' => $unit->code,
                    'name' => $unit->name,
                    'submitted' => $submission !== null,
                    'submission' => $submission ? [
                        'id' => $submission->id,
                        'status' => $submission->status ?? 'submitted',
                        'timeliness' => $submission->timeliness ?? 'on_time',
                        'comment' => $submission->comment,
                        'submitted_at' => $submission->submitted_at?->format('M d, Y H:i') ?? '',
                        'submitted_by' => $submission->submittedBy?->name ?? 'System',
                        'attachments' => $submission->attachments
                            ->map(fn ($attachment) => [
                                'id' => $attachment->id,
                                'original_name' => $attachment->original_name,
                                'mime_type' => $attachment->mime_type,
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

        return Inertia::render('my-sub-kra/action-plans-show', [
            'actionPlan' => [
                'id' => $actionPlan->id,
                'title' => $actionPlan->title,
                'description' => $actionPlan->description,
                'kpi' => [
                    'id' => $actionPlan->kpi->id,
                    'code' => $actionPlan->kpi->code,
                    'name' => $actionPlan->kpi->name,
                ],
                'reporting_period' => $reportingPeriod ? [
                    'id' => $reportingPeriod->id,
                    'period_start' => $reportingPeriod->period_start,
                    'period_end' => $reportingPeriod->period_end,
                    'late_submission_start' => $reportingPeriod->late_submission_start,
                    'late_submission_end' => $reportingPeriod->late_submission_end,
                ] : null,
                'reporting_periods' => $reportingPeriods,
                'progress' => method_exists($actionPlan, 'progressForPeriod') && $reportingPeriod
                    ? $actionPlan->progressForPeriod($reportingPeriod)
                    : 0,
                'responsible_units' => $responsibleUnits,
            ],
        ]);
    }
}