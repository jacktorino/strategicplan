<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class KraController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('kras/index');
    }
}
