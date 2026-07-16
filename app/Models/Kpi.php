<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kpi extends Model
{
    protected $fillable = [
        'sub_kra_id',
        'title',
        'description',
        'target',
        'unit_of_measure',
        'status',
        'remarks',
        'proposed_by',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function subKra()
    {
        return $this->belongsTo(SubKra::class);
    }

    public function proposer()
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function responsibleUnits()
    {
        return $this->belongsToMany(ResponsibleUnit::class);
    }

    public function actionPlans()
    {
        return $this->hasMany(InnovativeActionPlan::class);
    }

    public function progress()
    {
        return $this->hasMany(KpiProgress::class);
    }
}