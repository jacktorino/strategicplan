<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SubKraController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('sub-kras/index');
    }
}
