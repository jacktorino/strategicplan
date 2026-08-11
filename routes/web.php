<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KraController;
use App\Http\Controllers\MyKraController;
use App\Http\Controllers\MySubKraController;
use App\Http\Controllers\MyUnitController;
use App\Http\Controllers\OrganizationalUnitController;
use App\Http\Controllers\ReportingPeriodController;
use App\Http\Controllers\StrategicPlanController;
use App\Http\Controllers\SubKraController;
use App\Http\Controllers\SubmissionMonitoringController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public / Guest Routes
Route::inertia('/', 'welcome')->name('home');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');

    // Admin User Management CRUD
    Route::resource('users', UserController::class);

    // Executive & Admin Routes
    Route::get('/kras', [KraController::class, 'index'])->name('kras.index');
    Route::get('/sub-kras', [SubKraController::class, 'index'])->name('sub-kras.index');
    Route::get('/reporting-periods', [ReportingPeriodController::class, 'index'])->name('reporting-periods.index');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/strategic-plans', [StrategicPlanController::class, 'index'])->name('strategic-plans.index');
    Route::get('/kpis', [KpiController::class, 'index'])->name('kpis.index');
    Route::get('/submissions/manage', [SubmissionMonitoringController::class, 'manage'])->name('submissions.manage');
    Route::get('/organizational-units', [OrganizationalUnitController::class, 'index'])->name('organizational-units.index');

    // KRA Champion Routes
    Route::get('/my-kra/sub-kras', [MyKraController::class, 'subKras'])->name('my-kra.sub-kras');
    Route::get('/my-kra/kpis', [MyKraController::class, 'kpis'])->name('my-kra.kpis');
    Route::get('/my-kra/submissions', [MyKraController::class, 'submissions'])->name('my-kra.submissions');

    // Sub-KRA Owner Routes
    Route::get('/my-sub-kra/kpis', [MySubKraController::class, 'kpis'])->name('my-sub-kra.kpis');
    Route::get('/my-sub-kra/action-plans', [MySubKraController::class, 'actionPlans'])->name('my-sub-kra.action-plans');
    Route::get('/my-sub-kra/submissions', [MySubKraController::class, 'submissions'])->name('my-sub-kra.submissions');

    // Unit Head Routes
    Route::get('/my-unit/action-plans', [MyUnitController::class, 'actionPlans'])->name('my-unit.action-plans');
    Route::get('/my-unit/submit', [MyUnitController::class, 'submit'])->name('my-unit.submit');
    Route::get('/my-unit/submissions-history', [MyUnitController::class, 'submissionsHistory'])->name('my-unit.submissions-history');
});

require __DIR__.'/settings.php';