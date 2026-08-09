<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportingPeriod extends Model
{
    protected $fillable = [
        'strategic_plan_id',
        'period_start',
        'period_end',
        'late_submission_start',
        'late_submission_end',
    ];

    protected $casts = [
        'period_start' => 'datetime',
        'period_end' => 'datetime',
        'late_submission_start' => 'datetime',
        'late_submission_end' => 'datetime',
    ];

    public function strategicPlan(): BelongsTo
    {
        return $this->belongsTo(StrategicPlan::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ActionPlanSubmission::class);
    }
}