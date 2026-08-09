<?php

namespace App\Http\Controllers;

use App\Models\Kra;
use App\Models\StrategicPlan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KraController extends Controller
{
    public function create(
        StrategicPlan $strategicPlan
    ): Response {
        return Inertia::render('KRAs/Create', [
            'strategicPlan' => $strategicPlan,
            'users' => User::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'email',
                ]),
        ]);
    }

    public function store(
        Request $request,
        StrategicPlan $strategicPlan
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

            'champion_id' => [
                'nullable',
                'exists:users,id',
            ],
        ]);

        $strategicPlan->kras()->create($validated);

        return redirect()
            ->route('strategic-plans.show', $strategicPlan)
            ->with('success', 'KRA created successfully.');
    }

    public function edit(
        StrategicPlan $strategicPlan,
        Kra $kra
    ): Response {
        abort_unless(
            $kra->strategic_plan_id === $strategicPlan->id,
            404
        );

        return Inertia::render('KRAs/Edit', [
            'strategicPlan' => $strategicPlan,
            'kra' => $kra,
            'users' => User::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'email',
                ]),
        ]);
    }

    public function update(
        Request $request,
        StrategicPlan $strategicPlan,
        Kra $kra
    ): RedirectResponse {
        abort_unless(
            $kra->strategic_plan_id === $strategicPlan->id,
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

            'champion_id' => [
                'nullable',
                'exists:users,id',
            ],
        ]);

        $kra->update($validated);

        return redirect()
            ->route('strategic-plans.show', $strategicPlan)
            ->with('success', 'KRA updated successfully.');
    }

    public function destroy(
        StrategicPlan $strategicPlan,
        Kra $kra
    ): RedirectResponse {
        abort_unless(
            $kra->strategic_plan_id === $strategicPlan->id,
            404
        );

        $kra->delete();

        return redirect()
            ->route('strategic-plans.show', $strategicPlan)
            ->with('success', 'KRA deleted successfully.');
    }
}