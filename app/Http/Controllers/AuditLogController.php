<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('audit-logs/index');
    }
}
