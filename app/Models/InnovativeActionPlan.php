<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InnovativeActionPlan extends Model
{
    protected $fillable = [
        'kpi_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'expected_output'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function kpi()
    {
        return $this->belongsTo(Kpi::class);
    }
}