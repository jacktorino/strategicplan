<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kra extends Model
{
    protected $fillable = [
        'strategic_plan_id',
        'code',
        'name',
        'description',
        'champion_id',
    ];

    public function strategicPlan(): BelongsTo
    {
        return $this->belongsTo(StrategicPlan::class);
    }

    public function champion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'champion_id');
    }

    public function subKras(): HasMany
    {
        return $this->hasMany(SubKra::class);
    }
}