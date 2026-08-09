<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActionPlanSubmission extends Model
{
    protected $fillable = [
        'action_plan_id',
        'action_plan_unit_id',
        'reporting_period_id',
        'submitted_by',
        'comment',
        'submitted_at',
        'status',
        'timeliness',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function actionPlan(): BelongsTo
    {
        return $this->belongsTo(ActionPlan::class);
    }

    public function actionPlanUnit(): BelongsTo
    {
        return $this->belongsTo(
            ActionPlanUnit::class,
            'action_plan_unit_id'
        );
    }

    public function reportingPeriod(): BelongsTo
    {
        return $this->belongsTo(ReportingPeriod::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

  public function attachments(): HasMany
    {
        return $this->hasMany(
            SubmissionAttachment::class,
            'action_plan_submission_id'
        );
    }
}