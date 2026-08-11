<?php

namespace App\Enums;

enum UserRole: string
{
    case President = 'president';
    case Admin = 'admin';
    case KraChampion = 'kra_champion';
    case SubKraOwner = 'sub_kra_owner';
    case UnitHead = 'unit_head';

    public function label(): string
    {
        return match ($this) {
            self::President => 'President',
            self::Admin => 'Administrator',
            self::KraChampion => 'KRA Champion',
            self::SubKraOwner => 'Sub-KRA Owner',
            self::UnitHead => 'Unit Head',
        };
    }

    /** Roles with full institutional oversight (bypass most record-level checks). */
    public static function executive(): array
    {
        return [self::President, self::Admin];
    }

    /** Helper to get array of all enum string values. */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
