<?php

namespace App\Http\Controllers;

use App\Models\Kra;
use App\Models\SubKra;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubKraController extends Controller
{
    public function create(
        Kra $kra
    ): Response {
        return Inertia::render('SubKRAs/Create', [
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

    public function store(
        Request $request,
        Kra $kra
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

            'owner_id' => [
                'nullable',
                'exists:users,id',
            ],
        ]);

        $kra->subKras()->create($validated);

        return redirect()
            ->route('strategic-plans.show', $kra->strategic_plan_id)
            ->with('success', 'Sub-KRA created successfully.');
    }

    public function edit(
        Kra $kra,
        SubKra $subKra
    ): Response {
        abort_unless(
            $subKra->kra_id === $kra->id,
            404
        );

        return Inertia::render('SubKRAs/Edit', [
            'kra' => $kra,
            'subKra' => $subKra,
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
        Kra $kra,
        SubKra $subKra
    ): RedirectResponse {
        abort_unless(
            $subKra->kra_id === $kra->id,
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

            'owner_id' => [
                'nullable',
                'exists:users,id',
            ],
        ]);

        $subKra->update($validated);

        return redirect()
            ->route('strategic-plans.show', $kra->strategic_plan_id)
            ->with('success', 'Sub-KRA updated successfully.');
    }

    public function destroy(
        Kra $kra,
        SubKra $subKra
    ): RedirectResponse {
        abort_unless(
            $subKra->kra_id === $kra->id,
            404
        );

        $subKra->delete();

        return redirect()
            ->route('strategic-plans.show', $kra->strategic_plan_id)
            ->with('success', 'Sub-KRA deleted successfully.');
    }
}