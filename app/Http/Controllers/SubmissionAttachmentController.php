<?php

namespace App\Http\Controllers;

use App\Models\ActionPlanSubmission;
use App\Models\SubmissionAttachment;
use App\Services\SubmissionAttachmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubmissionAttachmentController extends Controller
{
    public function upload(
        Request $request,
        ActionPlanSubmission $submission,
        SubmissionAttachmentService $attachmentService
    ) {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
            ],
        ]);

        $actionPlanUnit = $submission->actionPlanUnit;

        $isAuthorized = $request->user()
            ->organizationalUnits()
            ->whereKey($actionPlanUnit->organizational_unit_id)
            ->exists();

        if (! $isAuthorized) {
            abort(403, 'You are not authorized to add an attachment to this submission.');
        }

        $attachment = $attachmentService->attach(
            $submission,
            $request->file('file')
        );

        return redirect()
            ->route('action-plans.show', [
                'actionPlan' => $actionPlanUnit->actionPlan->id,
                'reporting_period_id' => $submission->reporting_period_id,
            ])
            ->with('success', 'Attachment uploaded successfully.');
    }

    public function download(
        Request $request,
        SubmissionAttachment $attachment
    ): StreamedResponse {
        $submission = $attachment->submission;

        $actionPlanUnit = $submission->actionPlanUnit;

        $isAuthorized = $request->user()
            ->organizationalUnits()
            ->whereKey($actionPlanUnit->organizational_unit_id)
            ->exists();

        if (! $isAuthorized) {
            abort(403, 'You are not authorized to access this attachment.');
        }

        if (! Storage::disk('private')->exists($attachment->path)) {
            abort(404, 'Attachment file not found.');
        }

        return Storage::disk('private')->download(
            $attachment->path,
            $attachment->original_name,
            [
                'Content-Type' => $attachment->mime_type,
            ]
        );
    }


public function delete(
    Request $request,
    SubmissionAttachment $attachment
) {
    $submission = $attachment->submission;

    $actionPlanUnit = $submission->actionPlanUnit;

    $isAuthorized = $request->user()
        ->organizationalUnits()
        ->whereKey($actionPlanUnit->organizational_unit_id)
        ->exists();

    if (! $isAuthorized) {
        abort(
            403,
            'You are not authorized to delete this attachment.'
        );
    }

    if (Storage::disk('private')->exists($attachment->path)) {
        Storage::disk('private')->delete($attachment->path);
    }

    $reportingPeriodId = $submission->reporting_period_id;
    $actionPlanId = $actionPlanUnit->actionPlan->id;

    $attachment->delete();

    return redirect()
        ->route('action-plans.show', [
            'actionPlan' => $actionPlanId,
            'reporting_period_id' => $reportingPeriodId,
        ])
        ->with('success', 'Attachment deleted successfully.');
}



}