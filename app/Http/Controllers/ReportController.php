<?php

namespace App\Http\Controllers;

use App\Models\Kra;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    // Read-only for every role, so it lives outside the role-gated route
    // groups — see routes/web.php (registered next to /dashboard).

    public function index(): Response
    {
        $kras = Kra::with(['subKras.kpis:id,sub_kra_id,title,status'])
            ->orderBy('order_no')
            ->orderBy('number')
            ->get(['id', 'number', 'title', 'order_no']);

        $summary = $kras
            ->flatMap(fn (Kra $kra) => $kra->subKras)
            ->flatMap(fn ($subKra) => $subKra->kpis)
            ->groupBy('status')
            ->map->count();

        return Inertia::render('reports/index', [
            'kras' => $kras,
            'summary' => $summary,
        ]);
    }
}
