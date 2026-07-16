<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResponsibleUnit extends Model
{
    protected $fillable = [
        'name',
        'acronym'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function subKras()
    {
        return $this->hasMany(SubKra::class);
    }

    public function kpis()
    {
        return $this->belongsToMany(Kpi::class);
    }
}