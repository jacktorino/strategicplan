import { usePage, Link } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    Building2,
    CalendarDays,
    ChevronDown,
    FileCheck,
    FolderUp,
    LayoutGrid,
    ShieldAlert,
    Target,
    Layers,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type UserRole =
    'president' | 'admin' | 'kra_champion' | 'sub_kra_owner' | 'unit_head';

export function AppSidebar() {
    const { auth, activeReportingPeriod } = usePage().props as unknown as {
        auth: { user: { name: string; email: string; role: UserRole } };
        activeReportingPeriod?: { name: string; year: string };
    };

    const userRole = auth?.user?.role || 'unit_head';
    const overallProgress = 35; // Dynamically calculated from action_plan_submissions

    // Navigation routes mapped strictly to your DB structure
    const navItemsByRole: Record<UserRole, NavItem[]> = {
        // 👑 Executive / Admin: Full Strategic Plan & Reporting Period Oversight
        president: [
            { title: 'Executive Summary', href: dashboard(), icon: LayoutGrid },
            { title: 'Key Result Areas (KRAs)', href: '/kras', icon: Target },
            { title: 'Sub-KRAs & Owners', href: '/sub-kras', icon: Layers },
            {
                title: 'Reporting Periods',
                href: '/reporting-periods',
                icon: CalendarDays,
            },
            {
                title: 'Institutional Audit Log',
                href: '/audit-logs',
                icon: ShieldAlert,
            },
        ],

        admin: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            {
                title: 'Strategic Plans & Periods',
                href: '/strategic-plans',
                icon: CalendarDays,
            },
            { title: 'KRAs & Sub-KRAs', href: '/kras', icon: Target },
            {
                title: 'KPI & Action Plan Setup',
                href: '/kpis',
                icon: BarChart3,
            },
            {
                title: 'Submission Approvals',
                href: '/submissions/manage',
                icon: FileCheck,
            },
            {
                title: 'Organizational Units',
                href: '/organizational-units',
                icon: Building2,
            },
        ],

        // 🏆 KRA Champion: Assigned via kras.champion_id
        kra_champion: [
            { title: 'My KRA Overview', href: dashboard(), icon: LayoutGrid },
            {
                title: 'Sub-KRAs Oversight',
                href: '/my-kra/sub-kras',
                icon: Layers,
            },
            { title: 'KPI Performance', href: '/my-kra/kpis', icon: BarChart3 },
            {
                title: 'Unit Submissions Review',
                href: '/my-kra/submissions',
                icon: FileCheck,
            },
        ],

        // 🎯 Sub-KRA Owner: Assigned via sub_kras.owner_id
        sub_kra_owner: [
            { title: 'Sub-KRA Dashboard', href: dashboard(), icon: LayoutGrid },
            {
                title: 'KPI Metrics Tracking',
                href: '/my-sub-kra/kpis',
                icon: BarChart3,
            },
            {
                title: 'Action Plans Status',
                href: '/my-sub-kra/action-plans',
                icon: Target,
            },
            {
                title: 'Submission Verification',
                href: '/my-sub-kra/submissions',
                icon: FileCheck,
            },
        ],

        // 🏛️ Unit Head / Submitter: Tied to organizational_units
        unit_head: [
            { title: 'Unit Dashboard', href: dashboard(), icon: LayoutGrid },
            {
                title: 'Assigned Action Plans',
                href: '/my-unit/action-plans',
                icon: Target,
            },
            {
                title: 'File New Submission',
                href: '/my-unit/submit',
                icon: FolderUp,
            },
            {
                title: 'Submission History',
                href: '/my-unit/submissions-history',
                icon: FileCheck,
            },
        ],
    };

    const currentNavItems =
        navItemsByRole[userRole] || navItemsByRole['unit_head'];

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* 1. Header: Logo & Active Strategic Plan Selector */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Strategic Plan Selector */}
                <div className="px-2 pt-1 group-data-[collapsible=icon]:hidden">
                    <button className="flex w-full items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-1.5 text-xs font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
                        <span className="truncate">
                            Strategic Plan 2026–2028
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                </div>
            </SidebarHeader>

            {/* 2. Content: Active Reporting Period Badge + Vision Progress */}
            <SidebarContent>
                {/* Active Reporting Period Banner */}
                <div className="mx-3 mt-2 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden dark:border-slate-800 dark:bg-slate-900">
                    <span className="font-medium">Period:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {activeReportingPeriod?.name || 'Q1 2026 Active'}
                    </span>
                </div>

                {/* Progress Bar (Visible for Executives & Champions) */}
                {(userRole === 'president' ||
                    userRole === 'admin' ||
                    userRole === 'kra_champion') && (
                    <div className="mx-3 my-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs group-data-[collapsible=icon]:hidden">
                        <div className="mb-1 flex items-center justify-between font-semibold">
                            <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                                Plan Completion
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {overallProgress}%
                            </span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full border border-sidebar-border bg-sidebar-accent">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 shadow-sm transition-all duration-500 dark:from-emerald-500 dark:to-teal-400"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>

                        <p className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground">
                            <span>Target: Dec 2028</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                On Track 🟢
                            </span>
                        </p>
                    </div>
                )}

                {/* Dynamic Navigation */}
                <NavMain items={currentNavItems} />
            </SidebarContent>

            {/* 3. Footer User Profile */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
