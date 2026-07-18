<?php

use App\Http\Controllers\Admin\KraController;
use App\Http\Controllers\Admin\StrategicPlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KpiProgressController;
use App\Http\Controllers\ResponsibleUnitController;
use App\Http\Controllers\SubKraController;
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
    Route::resource('sub-kras', SubKraController::class);
    Route::resource('responsible-units', ResponsibleUnitController::class);
});

// Strategic Planner Routes
Route::middleware(['auth', 'role:strategic_planner'])->group(function () {
    //
});

// Key Result Area Routes
Route::middleware(['auth', 'role:key_result_area'])->group(function () {
    Route::resource('kpis', KpiController::class);
    Route::resource('progress', KpiProgressController::class);
});

// Viewer Routes
Route::middleware(['auth', 'role:viewer'])->group(function () {
    //
});

require __DIR__ . '/settings.php';