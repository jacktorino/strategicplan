<?php

namespace App\Services;

use App\Models\ActionPlanSubmission;
use App\Models\SubmissionAttachment;
use Illuminate\Http\UploadedFile;
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
        UploadedFile $file
    ): SubmissionAttachment {

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