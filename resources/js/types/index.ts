export * from './auth';
export * from './navigation';
export * from './ui';

import { Auth } from './auth';

// Global Inertia Props shared from HandleInertiaRequests middleware
export interface SharedData {
    auth: Auth;
    enums?: {
        userRoles: Array<{ value: string; label: string }>;
    };
    [key: string]: unknown;
}

// Convenience alias if components expect PageProps
export type PageProps<T = Record<string, unknown>> = T & SharedData;
