<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ActionPlanUnit extends Pivot
{
    protected $table = 'action_plan_units';

    public $incrementing = true;

    protected $fillable = [
        'action_plan_id',
        'organizational_unit_id',
    ];

    public function actionPlan(): BelongsTo
    {
        return $this->belongsTo(ActionPlan::class);
    }

    public function organizationalUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationalUnit::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ActionPlanSubmission::class, 'action_plan_unit_id');
    }
}