<?php

namespace App\Services;

use App\Models\ActionPlanSubmission;
use App\Models\SubmissionAttachment;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class SubmissionAttachmentService
{
    /**
     * Allowed proof file types.
     */
    private array $allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    /**
     * Maximum file size: 10 MB.
     */
    private int $maxFileSize = 10 * 1024 * 1024;

    public function attach(
        ActionPlanSubmission $submission,
        UploadedFile $file,
        User $user,
    ): SubmissionAttachment {

        /*
        |--------------------------------------------------------------------------
        | Authorize
        |--------------------------------------------------------------------------
        |
        | NOTE: if you're already calling $this->authorize('manageAttachments', $submission)
        | in the controller (recommended — see controller-integration-notes.md),
        | this check is redundant but harmless as defense-in-depth. If the
        | controller doesn't call authorize(), this is what protects the route.
        */

        if (Gate::forUser($user)->denies('manageAttachments', $submission)) {
            throw ValidationException::withMessages([
                'submission' => 'You are not authorized to attach files to this submission.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate file
        |--------------------------------------------------------------------------
        */

        if (! $file->isValid()) {
            throw ValidationException::withMessages([
                'file' => 'The uploaded file is invalid.',
            ]);
        }

        if ($file->getSize() > $this->maxFileSize) {
            throw ValidationException::withMessages([
                'file' => 'The file must not be larger than 10 MB.',
            ]);
        }

        if (! in_array(
            $file->getMimeType(),
            $this->allowedMimeTypes,
            true
        )) {
            throw ValidationException::withMessages([
                'file' => 'This file type is not allowed.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Store file
        |--------------------------------------------------------------------------
        */

        $path = $file->store(
            "submissions/{$submission->id}",
            'private'
        );

        /*
        |--------------------------------------------------------------------------
        | Create attachment record
        |--------------------------------------------------------------------------
        */

        return $submission->attachments()->create([
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);
    }
}
