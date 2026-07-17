<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KpiProgressController;
use App\Http\Controllers\KraController;
use App\Http\Controllers\ResponsibleUnitController;
use App\Http\Controllers\StrategicPlanController;
use App\Http\Controllers\SubKraController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::inertia('/', 'auth/login')->name('home');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('strategic-plans', StrategicPlanController::class);
    Route::resource('kras', KraController::class);
    Route::resource('sub-kras', SubKraController::class);
    Route::resource('responsible-units', ResponsibleUnitController::class);
    // Route::resource('users', UserController::class);
});

// Route::middleware(['auth', 'role:planning_officer'])->group(function () {
//     Route::get('/approvals', [ApprovalController::class, 'index']);
//     Route::put('/approvals/{kpi}', [ApprovalController::class, 'update']);
// });

Route::middleware(['auth', 'role:responsible_unit'])->group(function () {
    Route::resource('kpis', KpiController::class);
    Route::resource('progress', KpiProgressController::class);
});

Route::middleware(['auth', 'role:viewer'])->group(function () {
    // Route::get('/reports', [ReportController::class, 'index']);
});

require __DIR__ . '/settings.php';
