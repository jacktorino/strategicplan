<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubKra extends Model
{
    protected $fillable = [
        'kra_id',
        'code',
        'title',
        'description',
        'order_no'
    ];

    public function kra()
    {
        return $this->belongsTo(Kra::class);
    }



    public function kpis()
    {
        return $this->hasMany(Kpi::class);
    }
}

