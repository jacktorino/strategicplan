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
    SquarePen,
} from 'lucide-react';

export const menus: Record<
    'admin' | 'strategic_planner' | 'key_result_area' | 'viewer',
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
            href: '/admin/strategic_plan',
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
            href: '/admin/user',
            icon: Users,
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: FileBarChart,
        },
    ],

    strategic_planner: [
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

    key_result_area: [
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
            title: 'Propose a Kpi',
            href: '/kpis',
            icon: SquarePen,
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
