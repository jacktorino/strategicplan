<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InnovativeActionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InnovativeActionPlanController extends Controller
{
    // Action plans are managed inline from the KPI show page, so this
    // controller only needs store/update/destroy — index/create/edit are
    // handled by dialogs on admin/kpi/show.tsx rather than dedicated pages.

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        $plan = InnovativeActionPlan::create($validated);

        return back()->with('success', 'Action plan added.')->with('kpi_id', $plan->kpi_id);
    }

    public function update(Request $request, InnovativeActionPlan $actionPlan): RedirectResponse
    {
        $validated = $this->validated($request);

        $actionPlan->update($validated);

        return back()->with('success', 'Action plan updated.');
    }

    public function destroy(InnovativeActionPlan $actionPlan): RedirectResponse
    {
        $actionPlan->delete();

        return back()->with('success', 'Action plan deleted.');
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'kpi_id' => ['required', 'integer', 'exists:kpis,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'expected_output' => ['nullable', 'string'],
        ]);
    }
}
