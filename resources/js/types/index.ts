import type { PageProps } from '@inertiajs/core';

export interface SharedData extends PageProps {
    name: string;

    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: 'admin' | 'planning_officer' | 'responsible_unit' | 'viewer';
            responsible_unit_id: number | null;
        } | null;
    };

    sidebarOpen: boolean;
}

export type * from './auth';
export type * from './navigation';
export type * from './ui';
