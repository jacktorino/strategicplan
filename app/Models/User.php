<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'responsible_unit_id'
])]
#[Hidden([
    'password',
    'remember_token',
    'two_factor_secret',
    'two_factor_recovery_codes'
])]
class User extends Authenticatable implements PasskeyUser
{
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function responsibleUnit()
    {
        return $this->belongsTo(ResponsibleUnit::class);
    }

    public function proposedKpis()
    {
        return $this->hasMany(Kpi::class, 'proposed_by');
    }

    public function approvedKpis()
    {
        return $this->hasMany(Kpi::class, 'approved_by');
    }

    public function progressUpdates()
    {
        return $this->hasMany(KpiProgress::class, 'updated_by');
    }

    public function strategicPlans()
    {
        return $this->hasMany(StrategicPlan::class, 'created_by');
    }
}