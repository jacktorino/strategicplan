<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kpi extends Model
{
    protected $fillable = [
        'sub_kra_id',
        'code',
        'name',
        'description',
    ];

    public function subKra(): BelongsTo
    {
        return $this->belongsTo(SubKra::class);
    }

    public function actionPlans(): HasMany
    {
        return $this->hasMany(ActionPlan::class);
    }
}