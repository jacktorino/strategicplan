<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;



class DashboardController extends Controller
{
    public function index(Request $request)
{
    return match ($request->user()->role) {

        'admin' => Inertia::render('Dashboard/Admin'),

        'strategic_planner' => Inertia::render('Dashboard/PlanningOfficer'),

        'key_result_area' => Inertia::render('Dashboard/ResponsibleUnit'),

        'viewer' => Inertia::render('Dashboard/Viewer'),
    };
}
}