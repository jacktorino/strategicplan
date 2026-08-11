<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SubmissionMonitoringController extends Controller
{
    public function manage(): Response
    {
        return Inertia::render('submissions/manage');
    }
}
