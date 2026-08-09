<?php

use App\Http\Controllers\ActionPlanController;
use App\Http\Controllers\ActionPlanSubmissionController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KraController;
use App\Http\Controllers\StrategicPlanController;
use App\Http\Controllers\SubKraController;
use App\Http\Controllers\SubmissionAttachmentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::post(
        '/action-plan-units/{actionPlanUnit}/reporting-periods/{reportingPeriod}/submit',
        [ActionPlanSubmissionController::class, 'store']
    )->name('action-plan-submissions.store');

    Route::post(
    '/action-plan-submissions/{submission}/attachments',
    [SubmissionAttachmentController::class, 'upload']
)->name('submission-attachments.upload');

     Route::get(
        '/submission-attachments/{attachment}/download',
        [SubmissionAttachmentController::class, 'download']
    )->name('submission-attachments.download');

     Route::get(
        '/action-plans/{actionPlan}',
        [ActionPlanController::class, 'show']
    )->name('action-plans.show');


    Route::delete(
    '/submission-attachments/{attachment}',
    [SubmissionAttachmentController::class, 'delete']
)->name('submission-attachments.delete');

Route::patch(
    '/action-plan-submissions/{submission}',
    [ActionPlanSubmissionController::class, 'update']
)->name('action-plan-submissions.update');

Route::get('/strategic-plans', [ StrategicPlanController::class, 'index', ])->name('strategic-plans.index'); 
Route::get('/strategic-plans/{strategicPlan}', [ StrategicPlanController::class, 'show', ])->name('strategic-plans.show');

Route::get(
    '/strategic-plans/{strategicPlan}/kras/create',
    [KraController::class, 'create']
)->name('kras.create');

Route::post(
    '/strategic-plans/{strategicPlan}/kras',
    [KraController::class, 'store']
)->name('kras.store');

Route::get(
    '/strategic-plans/{strategicPlan}/kras/{kra}/edit',
    [KraController::class, 'edit']
)->name('kras.edit');

Route::put(
    '/strategic-plans/{strategicPlan}/kras/{kra}',
    [KraController::class, 'update']
)->name('kras.update');

Route::delete(
    '/strategic-plans/{strategicPlan}/kras/{kra}',
    [KraController::class, 'destroy']
)->name('kras.destroy');

Route::get(
    '/kras/{kra}/sub-kras/create',
    [SubKraController::class, 'create']
)->name('sub-kras.create');

Route::post(
    '/kras/{kra}/sub-kras',
    [SubKraController::class, 'store']
)->name('sub-kras.store');

Route::get(
    '/kras/{kra}/sub-kras/{subKra}/edit',
    [SubKraController::class, 'edit']
)->name('sub-kras.edit');

Route::put(
    '/kras/{kra}/sub-kras/{subKra}',
    [SubKraController::class, 'update']
)->name('sub-kras.update');

Route::delete(
    '/kras/{kra}/sub-kras/{subKra}',
    [SubKraController::class, 'destroy']
)->name('sub-kras.destroy');

Route::get('sub-kras/{subKra}/kpis/create', [KpiController::class, 'create'])->name('kpis.create');
Route::post('sub-kras/{subKra}/kpis', [KpiController::class, 'store'])->name('kpis.store');
Route::get('sub-kras/{subKra}/kpis/{kpi}/edit', [KpiController::class, 'edit'])->name('kpis.edit');
Route::put('sub-kras/{subKra}/kpis/{kpi}', [KpiController::class, 'update'])->name('kpis.update');
Route::delete('sub-kras/{subKra}/kpis/{kpi}', [KpiController::class, 'destroy'])->name('kpis.destroy');



Route::get(
    '/kpis/{kpi}/action-plans/create',
    [ActionPlanController::class, 'create']
)->name('action-plans.create');

Route::post(
    '/kpis/{kpi}/action-plans',
    [ActionPlanController::class, 'store']
)->name('action-plans.store');

Route::get(
    '/kpis/{kpi}/action-plans/{actionPlan}/edit',
    [ActionPlanController::class, 'edit']
)->name('action-plans.edit');

Route::put(
    '/kpis/{kpi}/action-plans/{actionPlan}',
    [ActionPlanController::class, 'update']
)->name('action-plans.update');

Route::delete(
    '/kpis/{kpi}/action-plans/{actionPlan}',
    [ActionPlanController::class, 'destroy']
)->name('action-plans.destroy');



});

require __DIR__.'/settings.php';
