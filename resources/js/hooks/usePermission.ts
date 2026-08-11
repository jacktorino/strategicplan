import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const hasRole = (role: string | string[]): boolean => {
        if (!user || !user.roles) return false;
        const rolesToCheck = Array.isArray(role) ? role : [role];
        return rolesToCheck.some((r) => user.roles?.includes(r));
    };

    const hasPermission = (permission: string | string[]): boolean => {
        if (!user || !user.permissions) return false;
        const permsToCheck = Array.isArray(permission)
            ? permission
            : [permission];
        return permsToCheck.some((p) => user.permissions?.includes(p));
    };

    return {
        hasRole,
        hasPermission,
        isExecutive: user?.is_executive ?? false,
        roleLabel: user?.role_label ?? '',
    };
}
