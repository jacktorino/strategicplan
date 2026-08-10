import { Head, Link } from '@inertiajs/react';

type StrategicPlan = {
    id: number;
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
};

type Summary = {
    total_kras: number;
    total_kpis: number;
    total_action_plans: number;

    expected_submissions: number;
    submitted_submissions: number;
    pending_submissions: number;

    on_time_submissions: number;
    late_submissions: number;

    overall_progress: number;
};

type Kra = {
    id: number;
    code: string;
    name: string;

    expected: number;
    submitted: number;
    pending: number;

    on_time: number;
    late: number;

    progress: number;
};

type Kpi = {
    id: number;
    code: string;
    name: string;

    expected: number;
    submitted: number;
    pending: number;

    on_time: number;
    late: number;

    progress: number;
};

type Unit = {
    id: number;
    code: string;
    name: string;

    expected: number;
    submitted: number;
    pending: number;

    on_time: number;
    late: number;

    progress: number;
};

type Period = {
    id: number;
    period_start: string;
    period_end: string;

    expected: number;
    submitted: number;
    pending: number;

    on_time: number;
    late: number;

    progress: number;
};

type Props = {
    strategicPlan: StrategicPlan;
    summary: Summary;
    kras: Kra[];
    kpis: Kpi[];
    units: Unit[];
    periods: Period[];
};

export default function Dashboard({
    strategicPlan,
    summary,
    kras,
    kpis,
    units,
    periods,
}: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatShortDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getProgressClass = (progress: number) => {
        if (progress >= 80) {
            return 'bg-green-500';
        }

        if (progress >= 50) {
            return 'bg-yellow-500';
        }

        return 'bg-red-500';
    };

    const getProgressTextClass = (progress: number) => {
        if (progress >= 80) {
            return 'text-green-600 dark:text-green-400';
        }

        if (progress >= 50) {
            return 'text-yellow-600 dark:text-yellow-400';
        }

        return 'text-red-600 dark:text-red-400';
    };

    const getComplianceLabel = (progress: number) => {
        if (progress >= 80) {
            return 'Good';
        }

        if (progress >= 50) {
            return 'Needs Attention';
        }

        return 'Low Compliance';
    };

    return (
        <>
            <Head title={`${strategicPlan.name} Dashboard`} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl space-y-8 p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Strategic Plan Dashboard
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                {strategicPlan.name}
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Academic Year {strategicPlan.academic_year}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {formatDate(strategicPlan.start_date)}
                                {' – '}
                                {formatDate(strategicPlan.end_date)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={`/strategic-plans/${strategicPlan.id}`}
                                className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                            >
                                Strategic Plan
                            </Link>

                            <Link
                                href={`/strategic-plans/${strategicPlan.id}/submission-monitoring`}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                Submission Monitoring
                            </Link>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* KRAs */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                KRAs
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {summary.total_kras}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Key Result Areas
                            </p>
                        </div>

                        {/* KPIs */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                KPIs
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {summary.total_kpis}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Key Performance Indicators
                            </p>
                        </div>

                        {/* Action Plans */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Action Plans
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {summary.total_action_plans}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Total action plans
                            </p>
                        </div>

                        {/* Overall Compliance */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Submission Compliance
                                    </p>

                                    <p
                                        className={`mt-2 text-3xl font-bold ${getProgressTextClass(
                                            summary.overall_progress,
                                        )}`}
                                    >
                                        {summary.overall_progress}%
                                    </p>
                                </div>

                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                    {getComplianceLabel(
                                        summary.overall_progress,
                                    )}
                                </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full transition-all ${getProgressClass(
                                        summary.overall_progress,
                                    )}`}
                                    style={{
                                        width: `${summary.overall_progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Overall Submission Compliance */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Overall Submission Compliance
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Submission progress across all action plans,
                                    responsible units, and reporting periods.
                                </p>
                            </div>

                            <div
                                className={`text-4xl font-bold ${getProgressTextClass(
                                    summary.overall_progress,
                                )}`}
                            >
                                {summary.overall_progress}%
                            </div>
                        </div>

                        <div className="mt-5 h-4 overflow-hidden rounded-full bg-muted">
                            <div
                                className={`h-full rounded-full transition-all ${getProgressClass(
                                    summary.overall_progress,
                                )}`}
                                style={{
                                    width: `${summary.overall_progress}%`,
                                }}
                            />
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Expected
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {summary.expected_submissions}
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Submitted
                                </p>

                                <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                                    {summary.submitted_submissions}
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Pending
                                </p>

                                <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {summary.pending_submissions}
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Late
                                </p>

                                <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                                    {summary.late_submissions}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border bg-muted/30 p-4">
                                <p className="text-sm text-muted-foreground">
                                    On-time submissions
                                </p>

                                <p className="mt-1 text-xl font-semibold">
                                    {summary.on_time_submissions}
                                </p>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Late submissions
                                </p>

                                <p className="mt-1 text-xl font-semibold">
                                    {summary.late_submissions}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reporting Period Performance */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-6">
                            <h2 className="text-lg font-semibold">
                                Reporting Period Performance
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Submission compliance for each reporting period.
                            </p>
                        </div>

                        {periods.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">
                                No reporting periods found.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {periods.map((period) => (
                                    <div key={period.id} className="p-6">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {formatShortDate(
                                                        period.period_start,
                                                    )}
                                                    {' – '}
                                                    {formatShortDate(
                                                        period.period_end,
                                                    )}
                                                </h3>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {period.submitted} of{' '}
                                                    {period.expected}{' '}
                                                    submissions completed
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p
                                                    className={`text-xl font-bold ${getProgressTextClass(
                                                        period.progress,
                                                    )}`}
                                                >
                                                    {period.progress}%
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {period.pending} pending
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all ${getProgressClass(
                                                    period.progress,
                                                )}`}
                                                style={{
                                                    width: `${period.progress}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                            <span>
                                                Expected:{' '}
                                                <strong className="text-foreground">
                                                    {period.expected}
                                                </strong>
                                            </span>

                                            <span>
                                                Submitted:{' '}
                                                <strong className="text-green-600 dark:text-green-400">
                                                    {period.submitted}
                                                </strong>
                                            </span>

                                            <span>
                                                Pending:{' '}
                                                <strong className="text-yellow-600 dark:text-yellow-400">
                                                    {period.pending}
                                                </strong>
                                            </span>

                                            <span>
                                                On-time:{' '}
                                                <strong className="text-foreground">
                                                    {period.on_time}
                                                </strong>
                                            </span>

                                            <span>
                                                Late:{' '}
                                                <strong className="text-red-600 dark:text-red-400">
                                                    {period.late}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* KRA Progress */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-6">
                            <h2 className="text-lg font-semibold">
                                KRA Submission Compliance
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Submission compliance across each Key Result
                                Area.
                            </p>
                        </div>

                        {kras.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">
                                No KRAs found.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {kras.map((kra) => (
                                    <div key={kra.id} className="p-6">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                        {kra.code}
                                                    </span>

                                                    <h3 className="font-semibold">
                                                        {kra.name}
                                                    </h3>
                                                </div>

                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {kra.submitted} of{' '}
                                                    {kra.expected} expected
                                                    submissions
                                                </p>
                                            </div>

                                            <span
                                                className={`text-xl font-bold ${getProgressTextClass(
                                                    kra.progress,
                                                )}`}
                                            >
                                                {kra.progress}%
                                            </span>
                                        </div>

                                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all ${getProgressClass(
                                                    kra.progress,
                                                )}`}
                                                style={{
                                                    width: `${kra.progress}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                            <span>
                                                Submitted:{' '}
                                                <strong className="text-green-600 dark:text-green-400">
                                                    {kra.submitted}
                                                </strong>
                                            </span>

                                            <span>
                                                Pending:{' '}
                                                <strong className="text-yellow-600 dark:text-yellow-400">
                                                    {kra.pending}
                                                </strong>
                                            </span>

                                            <span>
                                                On-time:{' '}
                                                <strong className="text-foreground">
                                                    {kra.on_time}
                                                </strong>
                                            </span>

                                            <span>
                                                Late:{' '}
                                                <strong className="text-red-600 dark:text-red-400">
                                                    {kra.late}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* KPI Progress */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-6">
                            <h2 className="text-lg font-semibold">
                                KPI Submission Compliance
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Submission compliance for each Key Performance
                                Indicator.
                            </p>
                        </div>

                        {kpis.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">
                                No KPIs found.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {kpis.map((kpi) => (
                                    <div key={kpi.id} className="p-6">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                                                        {kpi.code}
                                                    </span>

                                                    <h3 className="font-semibold">
                                                        {kpi.name}
                                                    </h3>
                                                </div>

                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {kpi.submitted} of{' '}
                                                    {kpi.expected} expected
                                                    submissions
                                                </p>
                                            </div>

                                            <span
                                                className={`text-xl font-bold ${getProgressTextClass(
                                                    kpi.progress,
                                                )}`}
                                            >
                                                {kpi.progress}%
                                            </span>
                                        </div>

                                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all ${getProgressClass(
                                                    kpi.progress,
                                                )}`}
                                                style={{
                                                    width: `${kpi.progress}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                            <span>
                                                Submitted:{' '}
                                                <strong className="text-green-600 dark:text-green-400">
                                                    {kpi.submitted}
                                                </strong>
                                            </span>

                                            <span>
                                                Pending:{' '}
                                                <strong className="text-yellow-600 dark:text-yellow-400">
                                                    {kpi.pending}
                                                </strong>
                                            </span>

                                            <span>
                                                On-time:{' '}
                                                <strong className="text-foreground">
                                                    {kpi.on_time}
                                                </strong>
                                            </span>

                                            <span>
                                                Late:{' '}
                                                <strong className="text-red-600 dark:text-red-400">
                                                    {kpi.late}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Organizational Unit Performance */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-6">
                            <h2 className="text-lg font-semibold">
                                Organizational Unit Performance
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Submission compliance of responsible
                                organizational units.
                            </p>
                        </div>

                        {units.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">
                                No organizational unit data found.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {units.map((unit) => (
                                    <div key={unit.id} className="p-6">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                                                        {unit.code}
                                                    </span>

                                                    <h3 className="font-semibold">
                                                        {unit.name}
                                                    </h3>
                                                </div>

                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {unit.submitted} of{' '}
                                                    {unit.expected} expected
                                                    submissions
                                                </p>
                                            </div>

                                            <span
                                                className={`text-xl font-bold ${getProgressTextClass(
                                                    unit.progress,
                                                )}`}
                                            >
                                                {unit.progress}%
                                            </span>
                                        </div>

                                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all ${getProgressClass(
                                                    unit.progress,
                                                )}`}
                                                style={{
                                                    width: `${unit.progress}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                            <span>
                                                Submitted:{' '}
                                                <strong className="text-green-600 dark:text-green-400">
                                                    {unit.submitted}
                                                </strong>
                                            </span>

                                            <span>
                                                Pending:{' '}
                                                <strong className="text-yellow-600 dark:text-yellow-400">
                                                    {unit.pending}
                                                </strong>
                                            </span>

                                            <span>
                                                On-time:{' '}
                                                <strong className="text-foreground">
                                                    {unit.on_time}
                                                </strong>
                                            </span>

                                            <span>
                                                Late:{' '}
                                                <strong className="text-red-600 dark:text-red-400">
                                                    {unit.late}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {summary.expected_submissions === 0 && (
                        <div className="rounded-xl border border-dashed bg-card p-10 text-center">
                            <h2 className="text-lg font-semibold">
                                No submissions to monitor yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                                Your strategic plan does not currently have any
                                expected submissions. Make sure you have action
                                plans, responsible organizational units, and
                                reporting periods configured.
                            </p>

                            <Link
                                href={`/strategic-plans/${strategicPlan.id}`}
                                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                Manage Strategic Plan
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
