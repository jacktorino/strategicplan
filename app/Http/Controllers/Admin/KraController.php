<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use App\Models\StrategicPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $kras = Kra::with('strategicPlan')
            ->when($request->filled('strategic_plan_id'), function ($query) use ($request) {
                $query->where('strategic_plan_id', $request->input('strategic_plan_id'));
            })
            ->orderBy('order_no')
            ->get();

        return Inertia::render('admin/kra', [
            'kras' => $kras,
            'strategicPlans' => StrategicPlan::select('id', 'title', 'school_year')
                ->orderBy('title')
                ->get(),
            'filters' => $request->only('strategic_plan_id'),
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
            'strategic_plan_id' => ['required', 'exists:strategic_plans,id'],
            'number' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order_no' => ['required', 'integer', 'min:1'],
        ]);

        Kra::create($validated);

        return redirect()
            ->route('kra.index')
            ->with('success', 'KRA created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, Kra $kra)
    {
        $validated = $request->validate([
            'strategic_plan_id' => ['required', 'exists:strategic_plans,id'],
            'number' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order_no' => ['required', 'integer', 'min:1'],
        ]);

        $kra->update($validated);

        return redirect()
            ->route('kra.index')
            ->with('success', 'KRA updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}