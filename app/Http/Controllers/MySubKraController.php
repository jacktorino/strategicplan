<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MySubKraController extends Controller
{
    public function kpis(): Response
    {
        return Inertia::render('my-sub-kra/kpis');
    }

    public function actionPlans(): Response
    {
        return Inertia::render('my-sub-kra/action-plans');
    }

    public function submissions(): Response
    {
        return Inertia::render('my-sub-kra/submissions');
    }
}
