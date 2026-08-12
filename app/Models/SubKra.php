<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubKra extends Model
{
    protected $fillable = [
        'kra_id',
        'code',
        'name',
        'description',
        'owner_id',
    ];

    public function kra(): BelongsTo
    {
        return $this->belongsTo(Kra::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(Kpi::class);
    }
}