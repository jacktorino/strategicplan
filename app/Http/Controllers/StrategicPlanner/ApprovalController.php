<?php

namespace App\Http\Controllers\StrategicPlanner;

use App\Http\Controllers\Controller;
use App\Models\Kpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->get('status', 'Pending');

        $kpis = Kpi::with(['subKra.kra', 'responsibleUnits'])
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->latest()
            ->get();

        return Inertia::render('strategic-planner/approvals/index', [
            'kpis' => $kpis,
            'filters' => ['status' => $status],
        ]);
    }

    public function approve(Request $request, Kpi $kpi): RedirectResponse
    {
        $kpi->update([
            'status' => 'Approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'KPI approved.');
    }

    public function reject(Request $request, Kpi $kpi): RedirectResponse
    {
        $request->validate([
            'remarks' => ['nullable', 'string'],
        ]);

        $kpi->update([
            'status' => 'Rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'remarks' => $request->input('remarks', $kpi->remarks),
        ]);

        return back()->with('success', 'KPI rejected.');
    }
}
