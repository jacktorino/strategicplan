<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Kpi;
use App\Models\ResponsibleUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgressController extends Controller
{
    /**
     * "My KPIs" — scoped to the KRA user's own sub_kra_id, never the whole table.
     */
    public function index(Request $request): Response
    {
        $user = $this->authorizedUser($request);

        $kpis = Kpi::with('responsibleUnits')
            ->withCount('progress')
            ->where('sub_kra_id', $user->sub_kra_id)
            ->latest()
            ->get();

        return Inertia::render('key-result-area/kpi/index', [
            'kpis' => $kpis,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorizedUser($request);

        return Inertia::render('key-result-area/kpi/form', [
            'responsibleUnits' => ResponsibleUnit::orderBy('name')->get(['id', 'name', 'acronym']),
        ]);
    }

    /**
     * Proposing a KPI always lands as Pending against the user's own sub_kra —
     * neither of those fields is accepted from the request.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $this->authorizedUser($request);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target' => ['nullable', 'string', 'max:255'],
            'unit_of_measure' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string'],
            'responsible_unit_ids' => ['array'],
            'responsible_unit_ids.*' => ['integer', 'exists:responsible_units,id'],
        ]);

        $responsibleUnitIds = $validated['responsible_unit_ids'] ?? [];
        unset($validated['responsible_unit_ids']);

        $validated['sub_kra_id'] = $user->sub_kra_id;
        $validated['status'] = 'Pending';
        $validated['proposed_by'] = $user->id;

        $kpi = Kpi::create($validated);
        $kpi->responsibleUnits()->sync($responsibleUnitIds);

        return to_route('key-result-area.kpi.index')
            ->with('success', 'KPI proposed. It is now pending approval.');
    }

    public function show(Request $request, Kpi $kpi): Response
    {
        $user = $this->authorizedUser($request);

        abort_unless($kpi->sub_kra_id === $user->sub_kra_id, 403);

        $kpi->load([
            'subKra.kra',
            'responsibleUnits',
            'progress' => fn ($q) => $q->orderBy('year')->orderBy('month'),
        ]);

        return Inertia::render('key-result-area/kpi/show', [
            'kpi' => $kpi,
        ]);
    }

    /**
     * Every action here requires the user to actually belong to a sub_kra —
     * an unassigned key_result_area account has nothing to scope queries to.
     */
    protected function authorizedUser(Request $request)
    {
        $user = $request->user();

        abort_unless($user->sub_kra_id, 403, 'Your account is not yet assigned to a Sub KRA. Contact an administrator.');

        return $user;
    }
}
