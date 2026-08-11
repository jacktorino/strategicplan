import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    FileCheck,
    FolderUp,
    Plus,
    ShieldCheck,
    Target,
} from 'lucide-react';

import { usePermission } from '@/hooks/usePermission';
import { dashboard } from '@/routes';
import type { SharedData } from '@/types';

export default function Dashboard() {
    const { hasRole, hasPermission, isExecutive, roleLabel } = usePermission();
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* 1. Header with User Role Badge */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back, {user?.name || 'User'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Here is an overview of your strategic objectives and
                            assigned tasks.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20 ring-inset">
                            {isExecutive && (
                                <ShieldCheck className="mr-1.5 size-3.5" />
                            )}
                            {roleLabel || 'Unit Head'}
                        </span>
                    </div>
                </div>

                {/* 2. Top Dynamic Stat Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Stat Card 1: Role Scope */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                {isExecutive
                                    ? 'Strategic Oversight'
                                    : 'Assigned Scope'}
                            </span>
                            <Target className="size-4 text-muted-foreground" />
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                            <p className="text-2xl font-bold">
                                {isExecutive ? 'Full Access' : roleLabel}
                            </p>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                Active
                            </span>
                        </div>
                    </div>

                    {/* Stat Card 2: Submissions / Approvals */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                {hasPermission('approve submissions')
                                    ? 'Pending Reviews'
                                    : 'Unit Submissions'}
                            </span>
                            <FileCheck className="size-4 text-muted-foreground" />
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                            <p className="text-2xl font-bold">
                                {hasPermission('approve submissions')
                                    ? 'Review Needed'
                                    : 'Action Plans'}
                            </p>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                In Progress
                            </span>
                        </div>
                    </div>

                    {/* Stat Card 3: Active Reporting Period */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                Reporting Period
                            </span>
                            <Calendar className="size-4 text-muted-foreground" />
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                            <p className="text-2xl font-bold">Q3 - 2026</p>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                Open
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Main Workspace Area Tailored by Permissions */}
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    {/* Executive / Admin Workspace */}
                    {isExecutive && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4 dark:border-sidebar-border">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Institutional Dashboard
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Monitor university-wide KRA achievements
                                        and strategic plans.
                                    </p>
                                </div>
                                {hasPermission('create kras') && (
                                    <Link
                                        href="/strategic-plans"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                    >
                                        <Plus className="size-3.5" />
                                        Manage Strategic Plans
                                    </Link>
                                )}
                            </div>
                            <div className="rounded-lg border border-dashed border-sidebar-border p-8 text-center text-muted-foreground">
                                Executive Strategic Plan metrics and audit
                                widgets go here.
                            </div>
                        </div>
                    )}

                    {/* Unit Head / Submitter Workspace */}
                    {!isExecutive && hasRole('unit_head') && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4 dark:border-sidebar-border">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Unit Submissions
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Upload evidence and report progress for
                                        assigned action plans.
                                    </p>
                                </div>
                                {hasPermission('create submissions') && (
                                    <Link
                                        href="/my-unit/submit"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                    >
                                        <FolderUp className="size-3.5" />
                                        File Submission
                                    </Link>
                                )}
                            </div>
                            <div className="rounded-lg border border-dashed border-sidebar-border p-8 text-center text-muted-foreground">
                                Active Unit Action Plans and submission status
                                table go here.
                            </div>
                        </div>
                    )}

                    {/* Champion & Sub-KRA Owner Workspace */}
                    {!isExecutive && !hasRole('unit_head') && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4 dark:border-sidebar-border">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {roleLabel} Oversight
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Review KPI metrics and verify
                                        submissions within your domain.
                                    </p>
                                </div>
                                <Link
                                    href="/kras"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
                                >
                                    <BarChart3 className="size-3.5" />
                                    View KPIs
                                </Link>
                            </div>
                            <div className="rounded-lg border border-dashed border-sidebar-border p-8 text-center text-muted-foreground">
                                KRA / Sub-KRA performance tracking and review
                                table go here.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
