<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActionPlan extends Model
{
    protected $fillable = [
        'kpi_id',
        'title',
        'description',
        'start_date',
        'end_date',
    ];

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(Kpi::class);
    }

    public function responsibleUnits(): BelongsToMany
    {
        return $this->belongsToMany(
            OrganizationalUnit::class,
            'action_plan_units',
            'action_plan_id',
            'organizational_unit_id'
        )
            ->using(ActionPlanUnit::class)
            ->withPivot('id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(
            ActionPlanSubmission::class,
            'action_plan_id'
        );
    }

    public function progressForPeriod(
        ReportingPeriod $reportingPeriod
    ): float {
        $totalUnits = $this->responsibleUnits()->count();

        if ($totalUnits === 0) {
            return 0;
        }

        $submittedUnits = $this->submissions()
            ->where('reporting_period_id', $reportingPeriod->id)
            ->where('status', 'submitted')
            ->distinct()
            ->count('action_plan_unit_id');

        return round(
            ($submittedUnits / $totalUnits) * 100,
            2
        );
    }
}

