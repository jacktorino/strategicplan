<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganizationalUnit extends Model
{
    protected $fillable = [
        'code',
        'name',
        'parent_id',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(
            OrganizationalUnit::class,
            'parent_id'
        );
    }

    public function children(): HasMany
    {
        return $this->hasMany(
            OrganizationalUnit::class,
            'parent_id'
        );
    }

    public function actionPlans(): BelongsToMany
    {
        return $this->belongsToMany(
            ActionPlan::class,
            'action_plan_units'
        );
    }


    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'organizational_unit_user'
        );
    }
}