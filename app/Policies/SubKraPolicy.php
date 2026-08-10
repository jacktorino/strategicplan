<?php

namespace App\Policies;

use App\Models\SubKra;
use App\Models\User;

class SubKraPolicy
{
    public function view(User $user, SubKra $subKra): bool
    {
        return true; // viewing is open to any authenticated user; scope in query if needed
    }

    public function update(User $user, SubKra $subKra): bool
    {
        return $user->isExecutive()
            || $subKra->owner_id === $user->id
            || $subKra->kra->champion_id === $user->id;
    }

    public function delete(User $user, SubKra $subKra): bool
    {
        return $user->isExecutive() || $subKra->kra->champion_id === $user->id;
    }
}
