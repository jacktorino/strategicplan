<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Validation\ValidationException;

class OrganizationalUnitUser extends Pivot
{
    protected $table = 'organizational_unit_user';

    protected $fillable = [
        'organizational_unit_id',
        'user_id',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    /** Roles allowed to be attached to an organizational unit. */
    public const ALLOWED_ROLES = [
        UserRole::UnitHead,
        UserRole::SubKraOwner,
    ];

    protected static function booted(): void
    {
        static::creating(function (self $pivot) {
            self::assertRoleEligible($pivot);
            self::enforceSinglePrimary($pivot);
        });

        static::updating(function (self $pivot) {
            self::enforceSinglePrimary($pivot);
        });
    }

    protected static function assertRoleEligible(self $pivot): void
    {
        $user = User::find($pivot->user_id);

        if (! $user) {
            return;
        }

        if (! in_array($user->role, self::ALLOWED_ROLES, true)) {
            throw ValidationException::withMessages([
                'user_id' => sprintf(
                    'Users with the "%s" role cannot be assigned to an organizational unit. Allowed roles: %s.',
                    $user->role?->label() ?? 'none',
                    implode(', ', array_map(fn ($r) => $r->label(), self::ALLOWED_ROLES))
                ),
            ]);
        }
    }

    /**
     * If this row is being marked primary, unset is_primary on the same
     * user's other unit rows so exactly one primary unit exists at a time.
     *
     * NOTE: only fires when a pivot row is saved individually (attach() with
     * a single id, or an explicit ->save()). Bulk sync()/attach() with many
     * ids in one call may not trigger per-row model events on every Laravel
     * version — verify against your version, or set is_primary explicitly
     * afterward via a dedicated "set primary unit" action instead of relying
     * solely on this hook.
     */
    protected static function enforceSinglePrimary(self $pivot): void
    {
        if (! $pivot->is_primary) {
            return;
        }

        static::where('user_id', $pivot->user_id)
            ->when($pivot->exists, fn ($q) => $q->whereKeyNot($pivot->getKey()))
            ->update(['is_primary' => false]);
    }
}
