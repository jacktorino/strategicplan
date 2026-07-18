<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kra extends Model
{
    protected $fillable = [
        'number',
        'title',
        'description',
        'order_no'
    ];


    public function subKras()
    {
        return $this->hasMany(SubKra::class);
    }
}