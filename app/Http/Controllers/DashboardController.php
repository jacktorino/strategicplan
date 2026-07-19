<?php

namespace App\Http\Controllers;

use App\Models\Kpi;
use App\Models\StrategicPlan;
use App\Models\Kra;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return match ($request->user()->role) {
            'admin' => $this->adminDashboard(),

            'strategic_planner' => Inertia::render('Dashboard/PlanningOfficer'),

            'key_result_area' => Inertia::render('Dashboard/ResponsibleUnit'),

            'viewer' => Inertia::render('Dashboard/Viewer'),
        };
    }

    private function adminDashboard(): Response
    {
        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'strategicPlans' => StrategicPlan::count(),
                'kras' => Kra::count(),
                'kpis' => Kpi::count(),
                'users' => User::count(),
            ],
            'kpiStatusBreakdown' => $this->kpiStatusBreakdown(),
            'kraBreakdown' => $this->kraBreakdown(),
            'monthlyProgress' => $this->monthlyProgress(),
        ]);
    }

    /**
     * Count of KPIs per status, in the enum's canonical order.
     * The `kpis.status` column stores: Pending, Approved, Rejected, Completed.
     */
    private function kpiStatusBreakdown(): array
    {
        $counts = Kpi::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Maps the DB's capitalized enum value to the lowercase key the
        // Admin.tsx page expects.
        $statusMap = [
            'Pending' => 'pending',
            'Approved' => 'approved',
            'Rejected' => 'rejected',
            'Completed' => 'completed',
        ];

        return collect($statusMap)
            ->map(fn (string $frontendKey, string $dbLabel) => [
                'status' => $frontendKey,
                'count' => (int) ($counts[$dbLabel] ?? 0),
            ])
            ->values()
            ->all();
    }

    /**
     * Total vs. completed KPI counts per KRA, joined through sub_kras
     * since kpis.sub_kra_id -> sub_kras.kra_id -> kras.id.
     */
    private function kraBreakdown(): array
    {
        return DB::table('kras')
            ->leftJoin('sub_kras', 'sub_kras.kra_id', '=', 'kras.id')
            ->leftJoin('kpis', 'kpis.sub_kra_id', '=', 'sub_kras.id')
            ->select(
                'kras.number',
                'kras.title',
                DB::raw('COUNT(kpis.id) as total'),
                DB::raw("SUM(CASE WHEN kpis.status = 'Completed' THEN 1 ELSE 0 END) as completed"),
            )
            ->groupBy('kras.id', 'kras.number', 'kras.title')
            ->orderBy('kras.number')
            ->get()
            ->map(fn ($row) => [
                'kra' => 'KRA ' . $row->number,
                'total' => (int) $row->total,
                'completed' => (int) $row->completed,
            ])
            ->all();
    }

    /**
     * Average accomplishment % across all KPIs, grouped by month/year,
     * in chronological order.
     */
    private function monthlyProgress(): array
    {
        return DB::table('kpi_progress')
            ->select(
                'year',
                'month',
                DB::raw('AVG(percentage) as avg_percentage'),
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => Carbon::createFromDate((int) $row->year, (int) $row->month, 1)
                    ->format('M Y'),
                'accomplishment' => round((float) $row->avg_percentage, 1),
            ])
            ->all();
    }
}
