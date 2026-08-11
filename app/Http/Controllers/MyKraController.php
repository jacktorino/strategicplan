<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MyKraController extends Controller
{
    public function subKras(): Response
    {
        return Inertia::render('my-kra/sub-kras');
    }

    public function kpis(): Response
    {
        return Inertia::render('my-kra/kpis');
    }

    public function submissions(): Response
    {
        return Inertia::render('my-kra/submissions');
    }
}
