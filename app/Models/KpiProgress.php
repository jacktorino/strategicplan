<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiProgress extends Model
{
    protected $table = 'kpi_progress';

    protected $fillable = [
        'kpi_id',
        'percentage',
        'month',
        'year',
        'remarks',
        'updated_by'
    ];

    public function kpi()
    {
        return $this->belongsTo(Kpi::class);
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}