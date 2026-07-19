<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kpi;
use App\Models\ResponsibleUnit;
use App\Models\SubKra;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KpiController extends Controller
{
 public function index(Request $request): Response
{
    $query = Kpi::with(['subKra.kra', 'responsibleUnits'])
        ->withCount(['actionPlans', 'progress']);

    if ($request->filled('sub_kra_id')) {
        $query->where('sub_kra_id', $request->integer('sub_kra_id'));
    }

    $kpis = $query->get()
        ->sort(function ($a, $b) {
            return version_compare($a->description, $b->description);
        })
        ->values();

    return Inertia::render('admin/kpi/index', [
        'kpis' => $kpis,
        'subKras' => SubKra::with('kra')
            ->orderBy('code')
            ->get([
                'id',
                'kra_id',
                'code',
                'title',
            ]),
        'filters' => $request->only('sub_kra_id'),
    ]);
}
    public function create(Request $request): Response
    {
        return Inertia::render('admin/kpi/form', [
            'subKras' => SubKra::with('kra')->orderBy('code')->get(['id', 'kra_id', 'code', 'title']),
            'responsibleUnits' => ResponsibleUnit::orderBy('name')->get(['id', 'name', 'acronym']),
            'selectedSubKraId' => $request->integer('sub_kra_id') ?: null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $responsibleUnitIds = $validated['responsible_unit_ids'] ?? [];
        unset($validated['responsible_unit_ids']);

        $validated['proposed_by'] = $request->user()->id;

        $kpi = Kpi::create($validated);
        $kpi->responsibleUnits()->sync($responsibleUnitIds);

        return to_route('kpi.index', ['sub_kra_id' => $kpi->sub_kra_id])
            ->with('success', 'KPI created.');
    }

    public function show(Kpi $kpi): Response
    {
        $kpi->load([
            'subKra.kra',
            'responsibleUnits',
            'actionPlans' => fn ($q) => $q->orderBy('start_date'),
            'progress' => fn ($q) => $q->orderBy('year')->orderBy('month'),
        ]);

        return Inertia::render('admin/kpi/show', [
            'kpi' => $kpi,
        ]);
    }

    public function edit(Kpi $kpi): Response
    {
        $kpi->load('responsibleUnits');

        return Inertia::render('admin/kpi/form', [
            'kpi' => $kpi,
            'subKras' => SubKra::with('kra')->orderBy('code')->get(['id', 'kra_id', 'code', 'title']),
            'responsibleUnits' => ResponsibleUnit::orderBy('name')->get(['id', 'name', 'acronym']),
        ]);
    }

    public function update(Request $request, Kpi $kpi): RedirectResponse
    {
        $validated = $this->validated($request, $kpi);
        $responsibleUnitIds = $validated['responsible_unit_ids'] ?? [];
        unset($validated['responsible_unit_ids']);

        $kpi->update($validated);
        $kpi->responsibleUnits()->sync($responsibleUnitIds);

        return to_route('kpi.index', ['sub_kra_id' => $kpi->sub_kra_id])
            ->with('success', 'KPI updated.');
    }

    public function destroy(Kpi $kpi): RedirectResponse
    {
        $subKraId = $kpi->sub_kra_id;

        $kpi->delete();

        return to_route('kpi.index', ['sub_kra_id' => $subKraId])
            ->with('success', 'KPI deleted.');
    }

    protected function validated(Request $request, ?Kpi $kpi = null): array
    {
        return $request->validate([
            'sub_kra_id' => ['required', 'integer', 'exists:sub_kras,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target' => ['nullable', 'string', 'max:255'],
            'unit_of_measure' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['Pending', 'Approved', 'Rejected', 'Completed'])],
            'remarks' => ['nullable', 'string'],
            'responsible_unit_ids' => ['array'],
            'responsible_unit_ids.*' => ['integer', 'exists:responsible_units,id'],
        ]);
    }
}
