<?php

namespace App\Http\Controllers;

use App\Models\StrategicPlan;
use Inertia\Inertia;
use Inertia\Response;

class StrategicPlanController extends Controller
{
    public function index(): Response
    {
    $strategicPlans = StrategicPlan::query()
    ->withCount([
        'kras',
        'reportingPeriods',
    ])
    ->orderByDesc('start_date')
    ->get([
        'id',
        'name',
        'academic_year',
        'start_date',
        'end_date',
    ]);

        return Inertia::render('StrategicPlans/Index', [
            'strategicPlans' => $strategicPlans,
        ]);
    }

    public function show(StrategicPlan $strategicPlan): Response
    {
        $strategicPlan->load([
            'kras.subKras.kpis.actionPlans',
            'reportingPeriods',
        ]);

        return Inertia::render('StrategicPlans/Show', [
            'strategicPlan' => $strategicPlan,
        ]);
    }
}

