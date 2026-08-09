<?php

namespace App\Http\Controllers;

use App\Models\Kpi;
use App\Models\SubKra;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KpiController extends Controller
{
    public function create(
        SubKra $subKra
    ): Response {
        return Inertia::render('KPIs/Create', [
            'subKra' => $subKra,
        ]);
    }

    public function store(
        Request $request,
        SubKra $subKra
    ): RedirectResponse {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $subKra->kpis()->create($validated);

        return redirect()
            ->route('strategic-plans.show', $subKra->kra->strategic_plan_id)
            ->with('success', 'KPI created successfully.');
    }

    public function edit(
        SubKra $subKra,
        Kpi $kpi
    ): Response {
        abort_unless(
            $kpi->sub_kra_id === $subKra->id,
            404
        );

        return Inertia::render('KPIs/Edit', [
            'subKra' => $subKra,
            'kpi' => $kpi,
        ]);
    }

    public function update(
        Request $request,
        SubKra $subKra,
        Kpi $kpi
    ): RedirectResponse {
        abort_unless(
            $kpi->sub_kra_id === $subKra->id,
            404
        );

        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $kpi->update($validated);

        return redirect()
            ->route('strategic-plans.show', $subKra->kra->strategic_plan_id)
            ->with('success', 'KPI updated successfully.');
    }

    public function destroy(
        SubKra $subKra,
        Kpi $kpi
    ): RedirectResponse {
        abort_unless(
            $kpi->sub_kra_id === $subKra->id,
            404
        );

        $kpi->delete();

        return redirect()
            ->route('strategic-plans.show', $subKra->kra->strategic_plan_id)
            ->with('success', 'KPI deleted successfully.');
    }
}