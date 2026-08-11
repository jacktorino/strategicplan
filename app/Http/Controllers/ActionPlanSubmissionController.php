<?php

namespace App\Http\Controllers;

use App\Models\ActionPlanSubmission;
use App\Models\ActionPlanUnit;
use App\Models\ReportingPeriod;
use App\Services\ActionPlanSubmissionService;
use App\Services\SubmissionAttachmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActionPlanSubmissionController extends Controller
{
    public function store(
        Request $request,
        ActionPlanUnit $actionPlanUnit,
        ReportingPeriod $reportingPeriod,
        ActionPlanSubmissionService $service,
        SubmissionAttachmentService $attachmentService
    ): RedirectResponse {
        $validated = $request->validate([
            'comment' => ['nullable', 'string', 'max:5000'],
            'file' => ['nullable', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx'],
        ]);

        DB::transaction(function () use ($request, $actionPlanUnit, $reportingPeriod, $service, $attachmentService, $validated) {
            $submission = $service->submit(
                actionPlanUnit: $actionPlanUnit,
                reportingPeriod: $reportingPeriod,
                user: $request->user(),
                comment: $validated['comment'] ?? null,
            );

            if ($request->hasFile('file')) {
                $attachmentService->attach(
                    $submission,
                    $request->file('file'),
                    $request->user(),
                );
            }
        });

        return redirect()
            ->route('my-unit.action-plans', [
                'reporting_period_id' => $reportingPeriod->id,
            ])
            ->with('success', 'Submission completed successfully.');
    }

    public function update(
        Request $request,
        ActionPlanSubmission $submission
    ): RedirectResponse {
        $validated = $request->validate([
            'comment' => ['nullable', 'string', 'max:5000'],
        ]);

        $submission->update([
            'comment' => $validated['comment'] ?? null,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Submission comment updated successfully.');
    }
}
