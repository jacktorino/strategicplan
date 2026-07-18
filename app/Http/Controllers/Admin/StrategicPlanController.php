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
    ->get();

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