<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StrategicPlan extends Model
{
    protected $fillable = [
        'title',
        'school_year',
        'description',
        'status',
        'created_by'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function kras()
    {
        return $this->hasMany(Kra::class);
    }
}