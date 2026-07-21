<?php

namespace App\Http\Controllers;

use App\Models\KpiProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KpiProgressController extends Controller
{
    // Progress entries are managed inline from the KPI show page (one row
    // per month/year), so only store/update/destroy are needed here.

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['updated_by'] = $request->user()->id;

        KpiProgress::create($validated);

        return back()->with('success', 'Progress recorded.');
    }

    public function update(Request $request, KpiProgress $progress): RedirectResponse
    {
        $validated = $this->validated($request, $progress);
        $validated['updated_by'] = $request->user()->id;

        $progress->update($validated);

        return back()->with('success', 'Progress updated.');
    }

    public function destroy(KpiProgress $progress): RedirectResponse
    {
        $progress->delete();

        return back()->with('success', 'Progress entry deleted.');
    }

    protected function validated(Request $request, ?KpiProgress $progress = null): array
    {
        return $request->validate([
            'percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'digits:4'],
            'remarks' => ['nullable', 'string'],
            'kpi_id' => [
                'required',
                'integer',
                'exists:kpis,id',
                Rule::unique('kpi_progress', 'kpi_id')
                    ->where(fn ($query) => $query
                        ->where('month', $request->integer('month'))
                        ->where('year', $request->integer('year')))
                    ->ignore($progress?->id),
            ],
        ]);
    }
}
