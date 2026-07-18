<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kpi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KpiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
          return Inertia::render('admin/kpi_show', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
  public function show(Kpi $kpi)
{
    $kpi->load([
        'subKra',
        'proposer',
        'approver',
        'responsibleUnits',
        'actionPlans',
        'progress',
    ]);

    return Inertia::render('admin/kpi_show', [
        'kpi' => $kpi,
    ]);
}
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
