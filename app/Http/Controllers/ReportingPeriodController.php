<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ReportingPeriodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reporting-periods/index');
    }
}
