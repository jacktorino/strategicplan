<?php

namespace App\Http\Controllers;

use App\Models\ActionPlanSubmission;
use App\Models\ActionPlanUnit;
use App\Models\ReportingPeriod;
use App\Services\ActionPlanSubmissionService;
use App\Services\SubmissionAttachmentService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ActionPlanSubmissionController extends Controller
{
    public function store(
        Request $request,
        ActionPlanUnit $actionPlanUnit,
        ReportingPeriod $reportingPeriod,
        ActionPlanSubmissionService $service,
        SubmissionAttachmentService $attachmentService
    ) {
        $validated = $request->validate([
            'comment' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'file' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
            ],
        ]);

        $submission = $service->submit(
            actionPlanUnit: $actionPlanUnit,
            reportingPeriod: $reportingPeriod,
            user: $request->user(),
            comment: $validated['comment'] ?? null,
        );

        $attachment = null;

      if ($request->hasFile('file')) {
    try {
        $attachment = $attachmentService->attach(
            $submission,
            $request->file('file')
        );
    } catch (\Throwable $e) {
        $submission->delete();

        throw $e;
    }
}




return redirect()
    ->route('action-plans.show', [
        'actionPlan' => $actionPlanUnit->actionPlan->id,
        'reporting_period_id' => $reportingPeriod->id,
    ])
    ->with('success', 'Submission successful.');
    }


public function update(
    Request $request,
    ActionPlanSubmission $submission
) {
    $submission->load('actionPlanUnit');

    $isAuthorized = $request->user()
        ->organizationalUnits()
        ->whereKey(
            $submission->actionPlanUnit->organizational_unit_id
        )
        ->exists();

    if (! $isAuthorized) {
        abort(
            403,
            'You are not authorized to edit this submission.'
        );
    }

    $validated = $request->validate([
        'comment' => [
            'nullable',
            'string',
            'max:5000',
        ],
    ]);

    $submission->update([
        'comment' => $validated['comment'] ?? null,
    ]);

    return redirect()
        ->route('action-plans.show', [
            'actionPlan' => $submission->actionPlanUnit->actionPlan->id,
            'reporting_period_id' => $submission->reporting_period_id,
        ])
        ->with('success', 'Comment updated successfully.');
}

    
}