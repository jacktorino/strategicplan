<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use App\Models\StrategicPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StrategicPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plans = StrategicPlan::with('creator')
            ->latest()
            ->get();

        return Inertia::render('admin/strategic_plan', [
            'plans' => $plans,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'school_year' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:Draft,Active,Archived'],
        ]);

        StrategicPlan::create([
            'title' => $validated['title'],
            'school_year' => $validated['school_year'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'created_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('strategic-plans.index')
            ->with('success', 'Strategic Plan created successfully.');
    }

    /**
     * Display the specified resource.
     */
public function show(StrategicPlan $strategicPlan)
{
    $strategicPlan->load('creator');

    $kras = Kra::with([
        'subKras.kpis.responsibleUnits',
        'subKras.kpis.actionPlans',
        'subKras.kpis.progress' => function ($query) {
            $query->orderBy('year')
                ->orderBy('month');
        },
    ])
        ->orderBy('order_no')
        ->get()
        ->map(function ($kra) {
            return [
                'id' => $kra->id,
                'number' => $kra->number,
                'title' => $kra->title,
                'description' => $kra->description,
                'order_no' => $kra->order_no,

                'sub_kras' => $kra->subKras->map(function ($subKra) {
                    return [
                        'id' => $subKra->id,
                        'code' => $subKra->code,
                        'title' => $subKra->title,
                        'description' => $subKra->description,
                        'order_no' => $subKra->order_no,

                        'kpis' => $subKra->kpis->map(function ($kpi) {
                            return [
                                'id' => $kpi->id,
                                'title' => $kpi->title,
                                'description' => $kpi->description,

                                'responsible_units' => $kpi->responsibleUnits
                                    ->map(function ($unit) {
                                        return $unit->acronym ?: $unit->name;
                                    })
                                    ->values(),

                                'action_plans' => $kpi->actionPlans
                                    ->map(function ($plan) {
                                        return [
                                            'id' => $plan->id,
                                            'title' => $plan->title,
                                            'description' => $plan->description,
                                            'start_date' => $plan->start_date,
                                            'end_date' => $plan->end_date,
                                            'expected_output' => $plan->expected_output,
                                        ];
                                    })
                                    ->values(),

                                'progress' => $kpi->progress
                                    ->map(function ($progress) {
                                        return [
                                            'month' => $progress->month,
                                            'year' => $progress->year,
                                            'percentage' => $progress->percentage,
                                        ];
                                    })
                                    ->values(),
                            ];
                        })->values(),
                    ];
                })->values(),
            ];
        });

    return Inertia::render('admin/strategic_plan_show', [
        'plan' => $strategicPlan,
        'kras' => $kras,
    ]);
}
    /**
     * Update the specified resource.
     */
    public function update(Request $request, StrategicPlan $strategicPlan)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'school_year' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:Draft,Active,Archived'],
        ]);

        $strategicPlan->update($validated);

        return redirect()
            ->route('strategic-plans.index')
            ->with('success', 'Strategic Plan updated successfully.');
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(StrategicPlan $strategicPlan)
    {
        $strategicPlan->delete();

        return redirect()
            ->route('strategic-plans.index')
            ->with('success', 'Strategic Plan deleted successfully.');
    }
}