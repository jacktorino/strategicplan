<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StrategicPlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('strategic-plans/index');
    }
}
