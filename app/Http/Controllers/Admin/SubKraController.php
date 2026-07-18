<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use App\Models\SubKra;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubKraController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SubKra::with('kra')->withCount('kpis');

        if ($request->filled('kra_id')) {
            $query->where('kra_id', $request->integer('kra_id'));
        }

        $subKras = $query
            ->orderBy('order_no')
            ->orderBy('code')
            ->get();

        return Inertia::render('admin/sub-kra/index', [
            'subKras' => $subKras,
            'kras' => Kra::orderBy('order_no')->orderBy('number')->get(['id', 'number', 'title']),
            'filters' => $request->only('kra_id'),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('admin/sub-kra/form', [
            'kras' => Kra::orderBy('order_no')->orderBy('number')->get(['id', 'number', 'title']),
            'selectedKraId' => $request->integer('kra_id') ?: null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        SubKra::create($validated);

        return to_route('subkra.index', ['kra_id' => $validated['kra_id']])
            ->with('success', 'Sub KRA created.');
    }

    public function edit(SubKra $subkra): Response
    {
        return Inertia::render('admin/sub-kra/form', [
            'subKra' => $subkra,
            'kras' => Kra::orderBy('order_no')->orderBy('number')->get(['id', 'number', 'title']),
        ]);
    }

    public function update(Request $request, SubKra $subkra): RedirectResponse
    {
        $validated = $this->validated($request);

        $subkra->update($validated);

        return to_route('subkra.index', ['kra_id' => $subkra->kra_id])
            ->with('success', 'Sub KRA updated.');
    }

    public function show(SubKra $subkra): Response
{
    $subkra->load([
        'kra',
        'kpis.responsibleUnits',
        'kpis.actionPlans',
        'kpis.progress',
    ]);

    return Inertia::render('admin/subkra_show', [
        'subKra' => $subkra,
    ]);
}

    public function destroy(SubKra $subkra): RedirectResponse
    {
        $kraId = $subkra->kra_id;

        $subkra->delete();

        return to_route('subkra.index', ['kra_id' => $kraId])
            ->with('success', 'Sub KRA deleted.');
    }

    protected function validated(Request $request): array
    {
        // Note: the sub_kras table has no `description` column (see
        // migration), even though the model lists it as fillable. Excluded
        // here on purpose — add the column first if you want to store it.
        return $request->validate([
            'kra_id' => ['required', 'integer', 'exists:kras,id'],
            'code' => ['required', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'order_no' => ['required', 'integer', 'min:1'],
        ]);
    }
}
