import type { NavItem } from '@/types';
import {
    LayoutDashboard,
    Target,
    FolderTree,
    Building2,
    Users,
    FileBarChart,
    ClipboardCheck,
    ChartColumn,
} from 'lucide-react';

export const menus: Record<
    'admin' | 'planning_officer' | 'responsible_unit' | 'viewer',
    NavItem[]
> = {
    admin: [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Strategic Plans',
            href: '/strategic-plans',
            icon: Target,
        },
        {
            title: 'KRAs',
            href: '/kras',
            icon: FolderTree,
        },
        {
            title: 'Sub KRAs',
            href: '/sub-kras',
            icon: FolderTree,
        },
        {
            title: 'Responsible Units',
            href: '/responsible-units',
            icon: Building2,
        },
        {
            title: 'Users',
            href: '/users',
            icon: Users,
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: FileBarChart,
        },
    ],

    planning_officer: [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'KPI Approvals',
            href: '/approvals',
            icon: ClipboardCheck,
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: FileBarChart,
        },
    ],

    responsible_unit: [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'My KPIs',
            href: '/kpis',
            icon: Target,
        },
        {
            title: 'Progress',
            href: '/progress',
            icon: ChartColumn,
        },
    ],

    viewer: [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: FileBarChart,
        },
    ],
};
