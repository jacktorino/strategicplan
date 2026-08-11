<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class OrganizationalUnitController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('organizational-units/index');
    }
}
