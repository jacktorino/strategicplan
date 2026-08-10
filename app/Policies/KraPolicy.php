<?php

namespace App\Policies;

use App\Models\Kra;
use App\Models\User;

class KraPolicy
{
    public function view(User $user, Kra $kra): bool
    {
        return true; // viewing is open to any authenticated user; scope in query if needed
    }

    public function update(User $user, Kra $kra): bool
    {
        return $user->isExecutive() || $kra->champion_id === $user->id;
    }

    public function delete(User $user, Kra $kra): bool
    {
        return $user->isExecutive();
    }
}
