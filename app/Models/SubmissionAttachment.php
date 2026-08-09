<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionAttachment extends Model
{
    protected $fillable = [
        'action_plan_submission_id',
        'original_name',
        'path',
        'mime_type',
        'size',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(
            ActionPlanSubmission::class,
            'action_plan_submission_id'
        );
    }
}