import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    ClipboardList,
    FileText,
    FolderKanban,
    Target,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

type ActionPlan = {
    id: number;
    title: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
};

type Kpi = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    action_plans?: ActionPlan[];
};

type SubKra = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    kpis?: Kpi[];
};

type Kra = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    sub_kras?: SubKra[];
};

type ReportingPeriod = {
    id: number;
    period_start: string;
    period_end: string;
    late_submission_start: string;
    late_submission_end: string;
};

type StrategicPlan = {
    id: number;
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    kras?: Kra[];
    reporting_periods?: ReportingPeriod[];
};

type Props = {
    strategicPlan: StrategicPlan;
};

function formatDate(date: string | null | undefined) {
    if (!date) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

function formatDateRange(
    start: string | null | undefined,
    end: string | null | undefined,
) {
    if (!start || !end) {
        return '—';
    }

    return `${formatDate(start)} – ${formatDate(end)}`;
}

export default function Show({ strategicPlan }: Props) {
    const kras = strategicPlan.kras ?? [];
    const reportingPeriods = strategicPlan.reporting_periods ?? [];

    // Track which KRA (if any) the confirm-delete dialog is open for.
    const [kraToDelete, setKraToDelete] = useState<Kra | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Track which Sub-KRA (if any) the confirm-delete dialog is open for.
    const [subKraToDelete, setSubKraToDelete] = useState<{
        kraId: number;
        subKra: SubKra;
    } | null>(null);
    const [deletingSubKra, setDeletingSubKra] = useState(false);

    // Track which KPI (if any) the confirm-delete dialog is open for.
    const [kpiToDelete, setKpiToDelete] = useState<{
        subKraId: number;
        kpi: Kpi;
    } | null>(null);
    const [deletingKpi, setDeletingKpi] = useState(false);

    // Track which Action Plan (if any) the confirm-delete dialog is open for.
    const [actionPlanToDelete, setActionPlanToDelete] = useState<{
        kpiId: number;
        actionPlan: ActionPlan;
    } | null>(null);
    const [deletingActionPlan, setDeletingActionPlan] = useState(false);

    const subKraCount = kras.reduce(
        (total, kra) => total + (kra.sub_kras?.length ?? 0),
        0,
    );

    const kpiCount = kras.reduce(
        (total, kra) =>
            total +
            (kra.sub_kras ?? []).reduce(
                (subTotal, subKra) => subTotal + (subKra.kpis?.length ?? 0),
                0,
            ),
        0,
    );

    const actionPlanCount = kras.reduce(
        (total, kra) =>
            total +
            (kra.sub_kras ?? []).reduce(
                (subTotal, subKra) =>
                    subTotal +
                    (subKra.kpis ?? []).reduce(
                        (kpiTotal, kpi) =>
                            kpiTotal + (kpi.action_plans?.length ?? 0),
                        0,
                    ),
                0,
            ),
        0,
    );

    const today = new Date();

    const currentPeriod = reportingPeriods.find((period) => {
        const start = new Date(period.period_start);
        const end = new Date(period.period_end);

        return today >= start && today <= end;
    });

    const handleDeleteKra = (kra: Kra) => {
        setDeleting(true);

        router.delete(`/strategic-plans/${strategicPlan.id}/kras/${kra.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setKraToDelete(null);

                toast.success('KRA deleted', {
                    description: `"${kra.name}" was deleted successfully.`,
                });
            },

            onError: () => {
                toast.error('Delete failed', {
                    description:
                        'Unable to delete this KRA. It may still have related Sub-KRAs, KPIs, or Action Plans.',
                });
            },

            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleDeleteSubKra = (kraId: number, subKra: SubKra) => {
        setDeletingSubKra(true);

        router.delete(`/kras/${kraId}/sub-kras/${subKra.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setSubKraToDelete(null);

                toast.success('Sub-KRA deleted', {
                    description: `"${subKra.name}" was deleted successfully.`,
                });
            },

            onError: () => {
                toast.error('Delete failed', {
                    description:
                        'Unable to delete this Sub-KRA. It may still have related KPIs.',
                });
            },

            onFinish: () => {
                setDeletingSubKra(false);
            },
        });
    };

    const handleDeleteKpi = (subKraId: number, kpi: Kpi) => {
        setDeletingKpi(true);

        router.delete(`/sub-kras/${subKraId}/kpis/${kpi.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setKpiToDelete(null);

                toast.success('KPI deleted', {
                    description: `"${kpi.name}" was deleted successfully.`,
                });
            },

            onError: () => {
                toast.error('Delete failed', {
                    description:
                        'Unable to delete this KPI. It may still have related Action Plans.',
                });
            },

            onFinish: () => {
                setDeletingKpi(false);
            },
        });
    };

    const handleDeleteActionPlan = (kpiId: number, actionPlan: ActionPlan) => {
        setDeletingActionPlan(true);

        router.delete(`/kpis/${kpiId}/action-plans/${actionPlan.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setActionPlanToDelete(null);

                toast.success('Action Plan deleted', {
                    description: `"${actionPlan.title}" was deleted successfully.`,
                });
            },

            onError: () => {
                toast.error('Delete failed', {
                    description: 'Unable to delete this Action Plan.',
                });
            },

            onFinish: () => {
                setDeletingActionPlan(false);
            },
        });
    };

    return (
        <>
            <Head title={strategicPlan.name} />

            <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link
                        href="/strategic-plans"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Strategic Plans
                    </Link>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Badge variant="secondary">
                                    {strategicPlan.academic_year}
                                </Badge>

                                {currentPeriod && <Badge>Current Period</Badge>}
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                {strategicPlan.name}
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Strategic planning dashboard and performance
                                overview.
                            </p>
                        </div>

                        <Card className="w-full md:w-auto">
                            <CardContent className="flex items-center gap-3 p-4">
                                <CalendarDays className="h-5 w-5 text-muted-foreground" />

                                <div>
                                    <p className="text-sm font-medium">
                                        Plan Duration
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {formatDateRange(
                                            strategicPlan.start_date,
                                            strategicPlan.end_date,
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Overview */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Key Result Areas
                                </p>

                                <Target className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">{kras.length}</p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Strategic focus areas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Sub-KRAs
                                </p>

                                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">{subKraCount}</p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Supporting areas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    KPIs
                                </p>

                                <Target className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">{kpiCount}</p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Performance indicators
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Action Plans
                                </p>

                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">
                                {actionPlanCount}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Implementation activities
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Reporting Period */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Current Reporting Period</CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Submission status for the current period.
                                </p>
                            </div>

                            {currentPeriod ? (
                                <Badge>Active</Badge>
                            ) : (
                                <Badge variant="secondary">
                                    No Active Period
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {currentPeriod ? (
                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-semibold">
                                            {formatDateRange(
                                                currentPeriod.period_start,
                                                currentPeriod.period_end,
                                            )}
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Regular submission period
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-medium">
                                            Late Submission
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {formatDateRange(
                                                currentPeriod.late_submission_start,
                                                currentPeriod.late_submission_end,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                There is currently no active reporting period.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Strategic Hierarchy */}
                <div className="space-y-4">
                    <div className="flex flex-row justify-between gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Strategic Framework
                            <p className="mt-1 text-sm text-muted-foreground">
                                Key result areas, supporting areas, indicators,
                                and action plans.
                            </p>
                        </h2>

                        <Link
                            href={`/strategic-plans/${strategicPlan.id}/kras/create`}
                        >
                            <Button>Create Key Result Area</Button>
                        </Link>
                    </div>

                    {kras.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Target className="mb-3 h-10 w-10 text-muted-foreground" />

                                <h3 className="font-semibold">No KRAs found</h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    This strategic plan does not have any key
                                    result areas yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {kras.map((kra) => (
                                <Card key={kra.id}>
                                    <CardHeader>
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary">
                                                        {kra.code}
                                                    </Badge>

                                                    <CardTitle>
                                                        {kra.name}
                                                    </CardTitle>
                                                </div>

                                                {kra.description && (
                                                    <p className="max-w-3xl text-sm text-muted-foreground">
                                                        {kra.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant="outline">
                                                    {kra.sub_kras?.length ?? 0}{' '}
                                                    Sub-KRAs
                                                </Badge>

                                                <Link
                                                    href={`/kras/${kra.id}/sub-kras/create`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    + Add Sub-KRA
                                                </Link>

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        className="rounded-md px-3 py-1.5 text-sm font-medium hover:underline"
                                                        href={`/strategic-plans/${strategicPlan.id}/kras/${kra.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>

                                                    <AlertDialog
                                                        open={
                                                            kraToDelete?.id ===
                                                            kra.id
                                                        }
                                                        onOpenChange={(
                                                            open,
                                                        ) => {
                                                            if (!open) {
                                                                setKraToDelete(
                                                                    null,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setKraToDelete(
                                                                        kra,
                                                                    )
                                                                }
                                                                className="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                                                            >
                                                                Delete
                                                            </button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete{' '}
                                                                    {kra.code}?
                                                                </AlertDialogTitle>

                                                                <AlertDialogDescription>
                                                                    This will
                                                                    permanently
                                                                    delete{' '}
                                                                    <strong>
                                                                        {
                                                                            kra.name
                                                                        }
                                                                    </strong>{' '}
                                                                    and its
                                                                    associated
                                                                    Sub-KRAs,
                                                                    KPIs, and
                                                                    Action
                                                                    Plans. This
                                                                    action
                                                                    cannot be
                                                                    undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>

                                                                <AlertDialogAction
                                                                    disabled={
                                                                        deleting
                                                                    }
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    onClick={() =>
                                                                        handleDeleteKra(
                                                                            kra,
                                                                        )
                                                                    }
                                                                >
                                                                    {deleting
                                                                        ? 'Deleting...'
                                                                        : 'Delete KRA'}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <Separator />

                                    <CardContent className="pt-6">
                                        {(kra.sub_kras?.length ?? 0) === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No Sub-KRAs have been defined
                                                for this KRA.
                                            </p>
                                        ) : (
                                            <div className="space-y-6">
                                                {kra.sub_kras?.map(
                                                    (subKra, subKraIndex) => (
                                                        <div
                                                            key={subKra.id}
                                                            className="space-y-4"
                                                        >
                                                            {subKraIndex >
                                                                0 && (
                                                                <Separator />
                                                            )}

                                                            <div className="space-y-2">
                                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <Badge variant="outline">
                                                                            {
                                                                                subKra.code
                                                                            }
                                                                        </Badge>

                                                                        <h3 className="font-semibold">
                                                                            {
                                                                                subKra.name
                                                                            }
                                                                        </h3>
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {subKra
                                                                                .kpis
                                                                                ?.length ??
                                                                                0}{' '}
                                                                            KPIs
                                                                        </span>

                                                                        <Link
                                                                            href={`/sub-kras/${subKra.id}/kpis/create`}
                                                                            className="text-xs font-medium text-primary hover:underline"
                                                                        >
                                                                            +
                                                                            Add
                                                                            KPI
                                                                        </Link>

                                                                        <Link
                                                                            href={`/kras/${kra.id}/sub-kras/${subKra.id}/edit`}
                                                                            className="text-xs font-medium hover:underline"
                                                                        >
                                                                            Edit
                                                                        </Link>

                                                                        <AlertDialog
                                                                            open={
                                                                                subKraToDelete
                                                                                    ?.subKra
                                                                                    .id ===
                                                                                subKra.id
                                                                            }
                                                                            onOpenChange={(
                                                                                open,
                                                                            ) => {
                                                                                if (
                                                                                    !open
                                                                                ) {
                                                                                    setSubKraToDelete(
                                                                                        null,
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            <AlertDialogTrigger
                                                                                asChild
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        setSubKraToDelete(
                                                                                            {
                                                                                                kraId: kra.id,
                                                                                                subKra,
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                    className="text-xs font-medium text-destructive hover:underline"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </AlertDialogTrigger>

                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>
                                                                                        Delete{' '}
                                                                                        {
                                                                                            subKra.code
                                                                                        }

                                                                                        ?
                                                                                    </AlertDialogTitle>

                                                                                    <AlertDialogDescription>
                                                                                        This
                                                                                        will
                                                                                        permanently
                                                                                        delete{' '}
                                                                                        <strong>
                                                                                            {
                                                                                                subKra.name
                                                                                            }
                                                                                        </strong>{' '}
                                                                                        and
                                                                                        its
                                                                                        associated
                                                                                        KPIs
                                                                                        and
                                                                                        Action
                                                                                        Plans.
                                                                                        This
                                                                                        action
                                                                                        cannot
                                                                                        be
                                                                                        undone.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>

                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>
                                                                                        Cancel
                                                                                    </AlertDialogCancel>

                                                                                    <AlertDialogAction
                                                                                        disabled={
                                                                                            deletingSubKra
                                                                                        }
                                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                        onClick={() =>
                                                                                            handleDeleteSubKra(
                                                                                                kra.id,
                                                                                                subKra,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {deletingSubKra
                                                                                            ? 'Deleting...'
                                                                                            : 'Delete Sub-KRA'}
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </div>
                                                                </div>

                                                                {subKra.description && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            subKra.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {(subKra.kpis
                                                                ?.length ??
                                                                0) === 0 ? (
                                                                <p className="text-sm text-muted-foreground">
                                                                    No KPIs have
                                                                    been defined
                                                                    for this
                                                                    Sub-KRA.
                                                                </p>
                                                            ) : (
                                                                <div className="grid gap-4 lg:grid-cols-2">
                                                                    {subKra.kpis?.map(
                                                                        (
                                                                            kpi,
                                                                        ) => (
                                                                            <Card
                                                                                key={
                                                                                    kpi.id
                                                                                }
                                                                                className="bg-muted/20"
                                                                            >
                                                                                <CardHeader className="pb-3">
                                                                                    <div className="flex items-start justify-between gap-3">
                                                                                        <div className="space-y-1">
                                                                                            <div className="flex flex-wrap items-center gap-2">
                                                                                                <Badge>
                                                                                                    {
                                                                                                        kpi.code
                                                                                                    }
                                                                                                </Badge>

                                                                                                <span className="font-medium">
                                                                                                    {
                                                                                                        kpi.name
                                                                                                    }
                                                                                                </span>
                                                                                            </div>

                                                                                            {kpi.description && (
                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                    {
                                                                                                        kpi.description
                                                                                                    }
                                                                                                </p>
                                                                                            )}
                                                                                        </div>

                                                                                        <div className="flex shrink-0 items-center gap-2">
                                                                                            <Link
                                                                                                href={`/sub-kras/${subKra.id}/kpis/${kpi.id}/edit`}
                                                                                                className="text-xs font-medium hover:underline"
                                                                                            >
                                                                                                Edit
                                                                                            </Link>

                                                                                            <AlertDialog
                                                                                                open={
                                                                                                    kpiToDelete
                                                                                                        ?.kpi
                                                                                                        .id ===
                                                                                                    kpi.id
                                                                                                }
                                                                                                onOpenChange={(
                                                                                                    open,
                                                                                                ) => {
                                                                                                    if (
                                                                                                        !open
                                                                                                    ) {
                                                                                                        setKpiToDelete(
                                                                                                            null,
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <AlertDialogTrigger
                                                                                                    asChild
                                                                                                >
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() =>
                                                                                                            setKpiToDelete(
                                                                                                                {
                                                                                                                    subKraId:
                                                                                                                        subKra.id,
                                                                                                                    kpi,
                                                                                                                },
                                                                                                            )
                                                                                                        }
                                                                                                        className="text-xs font-medium text-destructive hover:underline"
                                                                                                    >
                                                                                                        Delete
                                                                                                    </button>
                                                                                                </AlertDialogTrigger>

                                                                                                <AlertDialogContent>
                                                                                                    <AlertDialogHeader>
                                                                                                        <AlertDialogTitle>
                                                                                                            Delete{' '}
                                                                                                            {
                                                                                                                kpi.code
                                                                                                            }

                                                                                                            ?
                                                                                                        </AlertDialogTitle>

                                                                                                        <AlertDialogDescription>
                                                                                                            This
                                                                                                            will
                                                                                                            permanently
                                                                                                            delete{' '}
                                                                                                            <strong>
                                                                                                                {
                                                                                                                    kpi.name
                                                                                                                }
                                                                                                            </strong>{' '}
                                                                                                            and
                                                                                                            its
                                                                                                            associated
                                                                                                            Action
                                                                                                            Plans.
                                                                                                            This
                                                                                                            action
                                                                                                            cannot
                                                                                                            be
                                                                                                            undone.
                                                                                                        </AlertDialogDescription>
                                                                                                    </AlertDialogHeader>

                                                                                                    <AlertDialogFooter>
                                                                                                        <AlertDialogCancel>
                                                                                                            Cancel
                                                                                                        </AlertDialogCancel>

                                                                                                        <AlertDialogAction
                                                                                                            disabled={
                                                                                                                deletingKpi
                                                                                                            }
                                                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                                            onClick={() =>
                                                                                                                handleDeleteKpi(
                                                                                                                    subKra.id,
                                                                                                                    kpi,
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            {deletingKpi
                                                                                                                ? 'Deleting...'
                                                                                                                : 'Delete KPI'}
                                                                                                        </AlertDialogAction>
                                                                                                    </AlertDialogFooter>
                                                                                                </AlertDialogContent>
                                                                                            </AlertDialog>
                                                                                        </div>
                                                                                    </div>
                                                                                </CardHeader>

                                                                                <CardContent>
                                                                                    <div className="mb-3 flex items-center justify-between gap-3">
                                                                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                                                            Action
                                                                                            Plans
                                                                                        </p>

                                                                                        <Link
                                                                                            href={`/kpis/${kpi.id}/action-plans/create`}
                                                                                            className="text-xs font-medium text-primary hover:underline"
                                                                                        >
                                                                                            +
                                                                                            Add
                                                                                            Action
                                                                                            Plan
                                                                                        </Link>
                                                                                    </div>

                                                                                    {(kpi
                                                                                        .action_plans
                                                                                        ?.length ??
                                                                                        0) ===
                                                                                    0 ? (
                                                                                        <p className="text-sm text-muted-foreground">
                                                                                            No
                                                                                            action
                                                                                            plans
                                                                                            defined.
                                                                                        </p>
                                                                                    ) : (
                                                                                        <div className="space-y-2">
                                                                                            {kpi.action_plans?.map(
                                                                                                (
                                                                                                    actionPlan,
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            actionPlan.id
                                                                                                        }
                                                                                                        className="rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50"
                                                                                                    >
                                                                                                        <div className="flex items-start gap-3">
                                                                                                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                                                                                                            <div className="min-w-0 flex-1">
                                                                                                                <div className="flex items-start justify-between gap-3">
                                                                                                                    <Link
                                                                                                                        href={`/action-plans/${actionPlan.id}`}
                                                                                                                        className="font-medium hover:underline"
                                                                                                                    >
                                                                                                                        {
                                                                                                                            actionPlan.title
                                                                                                                        }
                                                                                                                    </Link>

                                                                                                                    <div className="flex shrink-0 items-center gap-2">
                                                                                                                        <Link
                                                                                                                            href={`/kpis/${kpi.id}/action-plans/${actionPlan.id}/edit`}
                                                                                                                            className="text-xs font-medium hover:underline"
                                                                                                                        >
                                                                                                                            Edit
                                                                                                                        </Link>

                                                                                                                        <AlertDialog
                                                                                                                            open={
                                                                                                                                actionPlanToDelete
                                                                                                                                    ?.actionPlan
                                                                                                                                    .id ===
                                                                                                                                actionPlan.id
                                                                                                                            }
                                                                                                                            onOpenChange={(
                                                                                                                                open,
                                                                                                                            ) => {
                                                                                                                                if (
                                                                                                                                    !open
                                                                                                                                ) {
                                                                                                                                    setActionPlanToDelete(
                                                                                                                                        null,
                                                                                                                                    );
                                                                                                                                }
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            <AlertDialogTrigger
                                                                                                                                asChild
                                                                                                                            >
                                                                                                                                <button
                                                                                                                                    type="button"
                                                                                                                                    onClick={() =>
                                                                                                                                        setActionPlanToDelete(
                                                                                                                                            {
                                                                                                                                                kpiId: kpi.id,
                                                                                                                                                actionPlan,
                                                                                                                                            },
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    className="text-xs font-medium text-destructive hover:underline"
                                                                                                                                >
                                                                                                                                    Delete
                                                                                                                                </button>
                                                                                                                            </AlertDialogTrigger>

                                                                                                                            <AlertDialogContent>
                                                                                                                                <AlertDialogHeader>
                                                                                                                                    <AlertDialogTitle>
                                                                                                                                        Delete
                                                                                                                                        Action
                                                                                                                                        Plan?
                                                                                                                                    </AlertDialogTitle>

                                                                                                                                    <AlertDialogDescription>
                                                                                                                                        This
                                                                                                                                        will
                                                                                                                                        permanently
                                                                                                                                        delete{' '}
                                                                                                                                        <strong>
                                                                                                                                            {
                                                                                                                                                actionPlan.title
                                                                                                                                            }
                                                                                                                                        </strong>

                                                                                                                                        .
                                                                                                                                        This
                                                                                                                                        action
                                                                                                                                        cannot
                                                                                                                                        be
                                                                                                                                        undone.
                                                                                                                                    </AlertDialogDescription>
                                                                                                                                </AlertDialogHeader>

                                                                                                                                <AlertDialogFooter>
                                                                                                                                    <AlertDialogCancel>
                                                                                                                                        Cancel
                                                                                                                                    </AlertDialogCancel>

                                                                                                                                    <AlertDialogAction
                                                                                                                                        disabled={
                                                                                                                                            deletingActionPlan
                                                                                                                                        }
                                                                                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                                                                        onClick={() =>
                                                                                                                                            handleDeleteActionPlan(
                                                                                                                                                kpi.id,
                                                                                                                                                actionPlan,
                                                                                                                                            )
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {deletingActionPlan
                                                                                                                                            ? 'Deleting...'
                                                                                                                                            : 'Delete Action Plan'}
                                                                                                                                    </AlertDialogAction>
                                                                                                                                </AlertDialogFooter>
                                                                                                                            </AlertDialogContent>
                                                                                                                        </AlertDialog>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                {actionPlan.description && (
                                                                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                                                                        {
                                                                                                                            actionPlan.description
                                                                                                                        }
                                                                                                                    </p>
                                                                                                                )}

                                                                                                                {(actionPlan.start_date ||
                                                                                                                    actionPlan.end_date) && (
                                                                                                                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                                                                                        <CalendarDays className="h-3.5 w-3.5" />

                                                                                                                        {formatDateRange(
                                                                                                                            actionPlan.start_date,
                                                                                                                            actionPlan.end_date,
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ),
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </CardContent>
                                                                            </Card>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reporting Periods */}
                <div className="space-y-4">
                    <div className="align-center flex flex-row justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Reporting Periods
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Submission windows for this strategic plan.
                        </p>

                        <Link
                            href={`/strategic-plans/${strategicPlan.id}/reporting-periods`}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            Reporting Periods
                        </Link>

                        <Link
                            href={`/strategic-plans/${strategicPlan.id}/submission-monitoring`}
                        >
                            Submission Monitoring
                        </Link>
                    </div>

                    {reportingPeriods.length === 0 ? (
                        <Card>
                            <CardContent className="py-10 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No reporting periods have been created.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reportingPeriods.map((period) => {
                                const start = new Date(period.period_start);
                                const end = new Date(period.period_end);

                                const isCurrent =
                                    today >= start && today <= end;

                                return (
                                    <Card
                                        key={period.id}
                                        className={
                                            isCurrent
                                                ? 'border-primary'
                                                : undefined
                                        }
                                    >
                                        <CardHeader>
                                            <div className="flex items-center justify-between gap-3">
                                                <CardTitle className="text-base">
                                                    {formatDateRange(
                                                        period.period_start,
                                                        period.period_end,
                                                    )}
                                                </CardTitle>

                                                {isCurrent && (
                                                    <Badge>Active</Badge>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Regular Submission
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {formatDateRange(
                                                        period.period_start,
                                                        period.period_end,
                                                    )}
                                                </p>
                                            </div>

                                            <Separator />

                                            <div>
                                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Late Submission
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {formatDateRange(
                                                        period.late_submission_start,
                                                        period.late_submission_end,
                                                    )}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
