<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kra extends Model
{
    protected $fillable = [
        'strategic_plan_id',
        'code',
        'title',
        'description',
        'order_no'
    ];

    public function strategicPlan()
    {
        return $this->belongsTo(StrategicPlan::class);
    }

    public function subKras()
    {
        return $this->hasMany(SubKra::class);
    }
}