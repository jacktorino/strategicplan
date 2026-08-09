<?php

use App\Http\Controllers\ActionPlanController;
use App\Http\Controllers\ActionPlanSubmissionController;
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

});

require __DIR__.'/settings.php';
