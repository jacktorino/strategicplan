<?php

use App\Http\Controllers\Admin\StrategicPlanController as AdminStrategicPlanController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KpiProgressController;
use App\Http\Controllers\KraController;
use App\Http\Controllers\ResponsibleUnitController;
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
    Route::resource('strategic-plans', AdminStrategicPlanController::class);
    Route::resource('kras', KraController::class);
    Route::resource('sub-kras', SubKraController::class);
    Route::resource('responsible-units', ResponsibleUnitController::class);

    // Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.index');
    Route::get('/admin/strategic_plan', [AdminStrategicPlanController::class, 'index'])->name('admin.strategic_plan.index');
    Route::get('/admin/user', [AdminUserController::class, 'index'])->name('admin.user.index');
    Route::get('/admin/user/create', [AdminUserController::class, 'create'])->name('admin.user.create');
    Route::post('/admin/users', [AdminUserController::class, 'store'])->name('admin.user.store');
});

Route::middleware(['auth', 'role:strategic_planner'])->group(function () {
    // Route::get('/approvals', [ApprovalController::class, 'index']);
    // Route::put('/approvals/{kpi}', [ApprovalController::class, 'update']);
});

Route::middleware(['auth', 'role:key_result_area'])->group(function () {
    Route::resource('kpis', KpiController::class);
    Route::resource('progress', KpiProgressController::class);
});

Route::middleware(['auth', 'role:viewer'])->group(function () {
    // Route::get('/reports', [ReportController::class, 'index']);
});

require __DIR__ . '/settings.php';