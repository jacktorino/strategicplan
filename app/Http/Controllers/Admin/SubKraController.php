<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use App\Models\StrategicPlan;
use App\Models\SubKra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubKraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $subKras = SubKra::with([
                'kra:id,number,title,strategic_plan_id',
                'kra.strategicPlan:id,school_year',
            ])
            ->when($request->kra_id, fn ($query, $kraId) => $query->where('kra_id', $kraId))
            ->when(
                $request->strategic_plan_id,
                fn ($query, $planId) => $query->whereHas(
                    'kra',
                    fn ($kraQuery) => $kraQuery->where('strategic_plan_id', $planId),
                ),
            )
            ->orderBy('kra_id')
            ->orderBy('order_no')
            ->get()
            ->each(function ($subKra) {
                $subKra->kra->school_year = $subKra->kra->strategicPlan->school_year ?? null;
                unset($subKra->kra->strategicPlan);
            });

        $kras = Kra::with('strategicPlan:id,school_year')
            ->when(
                $request->strategic_plan_id,
                fn ($query, $planId) => $query->where('strategic_plan_id', $planId),
            )
            ->orderBy('strategic_plan_id')
            ->orderBy('number')
            ->get(['id', 'number', 'title', 'strategic_plan_id'])
            ->map(function ($kra) {
                return [
                    'id' => $kra->id,
                    'number' => $kra->number,
                    'title' => $kra->title,
                    'strategic_plan_id' => $kra->strategic_plan_id,
                    'school_year' => $kra->strategicPlan->school_year ?? null,
                ];
            });

        $strategicPlans = StrategicPlan::orderByDesc('school_year')
            ->get(['id', 'title', 'school_year']);

        return Inertia::render('admin/subkra', [
            'subKras' => $subKras,
            'kras' => $kras,
            'strategicPlans' => $strategicPlans,
            'filters' => $request->only('kra_id', 'strategic_plan_id'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kra_id' => ['required', 'exists:kras,id'],
            'code' => ['required', 'string', 'max:20'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order_no' => ['nullable', 'integer', 'min:1'],
        ]);

        SubKra::create($validated);

        return back()->with('success', 'Sub-KRA created.');
    }

    /**
     * Display the specified resource.
     */
public function show(SubKra $subkra)
{
    $subkra->load([
        'kra',
        'kpis',
    ]);

    return Inertia::render('admin/subkra_show', [
        'subKra' => $subkra,
    ]);
}
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $subKra = SubKra::findOrFail($id);

        $validated = $request->validate([
            'kra_id' => ['required', 'exists:kras,id'],
            'code' => ['required', 'string', 'max:20'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order_no' => ['nullable', 'integer', 'min:1'],
        ]);

        $subKra->update($validated);

        return back()->with('success', 'Sub-KRA updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        SubKra::findOrFail($id)->delete();

        return back()->with('success', 'Sub-KRA deleted.');
    }
}