<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StrategicPlan extends Model
{
    protected $fillable = [
        'name',
        'academic_year',
        'start_date',
        'end_date',
    ];

    public function kras(): HasMany
    {
        return $this->hasMany(Kra::class);
    }

    public function reportingPeriods(): HasMany
    {
        return $this->hasMany(ReportingPeriod::class);
    }
}