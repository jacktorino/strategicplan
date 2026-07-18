<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KraController extends Controller
{
    public function index(): Response
    {
        $kras = Kra::withCount('subKras')
            ->orderBy('order_no')
            ->orderBy('number')
            ->get();

        return Inertia::render('admin/kra/index', [
            'kras' => $kras,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/kra/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        Kra::create($validated);

        return to_route('kra.index')->with('success', 'KRA created.');
    }

    public function edit(Kra $kra): Response
    {
        return Inertia::render('admin/kra/form', [
            'kra' => $kra,
        ]);
    }

    public function update(Request $request, Kra $kra): RedirectResponse
    {
        $validated = $this->validated($request, $kra);

        $kra->update($validated);

        return to_route('kra.index')->with('success', 'KRA updated.');
    }

    public function destroy(Kra $kra): RedirectResponse
    {
        $kra->delete();

        return to_route('kra.index')->with('success', 'KRA deleted.');
    }

    protected function validated(Request $request, ?Kra $kra = null): array
    {
        return $request->validate([
            'number' => ['required', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order_no' => ['required', 'integer', 'min:1'],
        ]);
    }
}
