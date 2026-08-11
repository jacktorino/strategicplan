<?php

namespace App\Http\Controllers;

use App\Models\ActionPlanSubmission;
use App\Models\SubmissionAttachment;
use App\Services\SubmissionAttachmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubmissionAttachmentController extends Controller
{
    public function upload(
        Request $request,
        ActionPlanSubmission $submission,
        SubmissionAttachmentService $attachmentService
    ): RedirectResponse {
        $this->authorize('manageAttachments', $submission);

        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
            ],
        ]);

        $attachmentService->attach(
            $submission,
            $request->file('file'),
            $request->user(),
        );

        return redirect()
            ->back()
            ->with('success', 'Attachment uploaded successfully.');
    }

    public function download(
        Request $request,
        SubmissionAttachment $attachment
    ): StreamedResponse {
        $submission = $attachment->submission;

        $this->authorize('download', $submission);

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
    ): RedirectResponse {
        $submission = $attachment->submission;

        $this->authorize('manageAttachments', $submission);

        if (Storage::disk('private')->exists($attachment->path)) {
            Storage::disk('private')->delete($attachment->path);
        }

        $attachment->delete();

        return redirect()
            ->back()
            ->with('success', 'Attachment deleted successfully.');
    }
}
