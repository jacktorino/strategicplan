<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create all roles directly from the UserRole Enum
        foreach (UserRole::cases() as $userRole) {
            Role::findOrCreate($userRole->value);
        }

        // 3. Define permissions grouped by domain
        $permissions = [
            // KRA Management
            'view kras',
            'create kras',
            'edit kras',
            'delete kras',

            // Sub-KRA Management
            'view sub_kras',
            'create sub_kras',
            'edit sub_kras',
            'delete sub_kras',

            // Action Plan Submissions
            'view submissions',
            'create submissions',
            'approve submissions',
            'reject submissions',

            // Organizational Units & System Setup
            'manage organizational units',
            'manage users',
            'view audit logs',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // 4. Assign Permissions to Roles

        // Administrator & President (Full system access)
        $adminRole = Role::findByName(UserRole::Admin->value);
        $adminRole->givePermissionTo(Permission::all());

        $presidentRole = Role::findByName(UserRole::President->value);
        $presidentRole->givePermissionTo(Permission::all());

        // KRA Champion
        $kraChampion = Role::findByName(UserRole::KraChampion->value);
        $kraChampion->givePermissionTo([
            'view kras',
            'create kras',
            'edit kras',
            'view sub_kras',
            'create sub_kras',
            'edit sub_kras',
            'view submissions',
            'approve submissions',
            'reject submissions',
        ]);

        // Sub-KRA Owner
        $subKraOwner = Role::findByName(UserRole::SubKraOwner->value);
        $subKraOwner->givePermissionTo([
            'view kras',
            'view sub_kras',
            'edit sub_kras',
            'view submissions',
            'create submissions',
        ]);

        // Unit Head
        $unitHead = Role::findByName(UserRole::UnitHead->value);
        $unitHead->givePermissionTo([
            'view kras',
            'view sub_kras',
            'view submissions',
            'create submissions',
        ]);
    }
}
