<?php

use App\Http\Controllers\Admin\InnovativeActionPlanController;
use App\Http\Controllers\Admin\KpiController;
use App\Http\Controllers\Admin\KraController;
use App\Http\Controllers\Admin\StrategicPlanController;
use App\Http\Controllers\Admin\SubKraController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;

use App\Http\Controllers\KpiProgressController;
use App\Http\Controllers\ResponsibleUnitController;
use Illuminate\Support\Facades\Route;

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::inertia('/', 'auth/login')->name('home');
});

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

// Admin Routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('strategic-plans', StrategicPlanController::class);
    Route::resource('user', UserController::class);
    Route::resource('kra', KraController::class);
    Route::resource('subkra', SubKraController::class);
    Route::resource('responsible-units', ResponsibleUnitController::class);
    Route::resource('kpi', KpiController::class);

    // Action plans are managed inline from the KPI show page, so only the
    // mutating actions are exposed (no index/create/edit views for this).
    Route::resource('action-plans', InnovativeActionPlanController::class)
        ->only(['store', 'update', 'destroy']);

    // NOTE: progress.store/update/destroy are intentionally NOT re-registered
    // here — they're already defined below under the key_result_area group,
    // and Laravel doesn't support two resource groups sharing the same route
    // names cleanly (the second registration wins, silently breaking the
    // first group's middleware). If admins also need to record progress,
    // either widen that group's role check (e.g. `role:admin,key_result_area`
    // if your middleware supports a role list) or move the progress routes
    // up here instead.
});

// Strategic Planner Routes
Route::middleware(['auth', 'role:strategic_planner'])->group(function () {
    //
});

// Key Result Area Routes
Route::middleware(['auth', 'role:key_result_area'])
    ->prefix('key-result-area')
    ->name('key-result-area.')
    ->group(function () {

        Route::resource('kpi', KpiController::class)
            ->only(['index', 'show']);

        Route::resource('progress', KpiProgressController::class)
            ->only(['store', 'update', 'destroy']);
    });
// Viewer Routes
Route::middleware(['auth', 'role:viewer'])->group(function () {
    //
});

require __DIR__ . '/settings.php';
