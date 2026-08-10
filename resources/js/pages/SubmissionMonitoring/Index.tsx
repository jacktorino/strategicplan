import { Head, Link, router } from '@inertiajs/react';

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
};

type Summary = {
    total: number;
    submitted: number;
    pending: number;
    on_time: number;
    late: number;
    progress: number;
};

type Submission = {
    id: number;
    status: string;
    timeliness: string;
    comment: string | null;
    submitted_at: string;
    submitted_by: string | null;
    attachments_count: number;
};

type MonitoringRow = {
    action_plan_id: number;
    action_plan_title: string;

    kpi: {
        id: number;
        code: string;
        name: string;
    };

    organizational_unit: {
        id: number;
        code: string;
        name: string;
    };

    submitted: boolean;
    submission: Submission | null;
};

type Props = {
    strategicPlan: StrategicPlan;
    reportingPeriods: ReportingPeriod[];
    reportingPeriod: ReportingPeriod;
    summary: Summary;
    rows: MonitoringRow[];
};

export default function Index({
    strategicPlan,
    reportingPeriods,
    reportingPeriod,
    summary,
    rows,
}: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const changePeriod = (periodId: string) => {
        router.get(
            `/strategic-plans/${strategicPlan.id}/submission-monitoring`,
            {
                reporting_period_id: periodId,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Submission Monitoring" />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl space-y-6 p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {strategicPlan.academic_year}
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Submission Monitoring
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Monitor action plan submissions across
                                responsible organizational units.
                            </p>
                        </div>

                        <Link
                            href={`/strategic-plans/${strategicPlan.id}`}
                            className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                        >
                            Back to Strategic Plan
                        </Link>
                    </div>

                    {/* Reporting Period */}
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Strategic Plan
                                </p>

                                <p className="mt-1 font-semibold">
                                    {strategicPlan.name}
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="reporting-period"
                                    className="text-sm text-muted-foreground"
                                >
                                    Reporting Period
                                </label>

                                <select
                                    id="reporting-period"
                                    value={reportingPeriod.id.toString()}
                                    onChange={(event) =>
                                        changePeriod(event.target.value)
                                    }
                                    className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
                                >
                                    {reportingPeriods.map((period) => (
                                        <option
                                            key={period.id}
                                            value={period.id}
                                        >
                                            {formatDate(period.period_start)}
                                            {' – '}
                                            {formatDate(period.period_end)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <div className="grid gap-3 text-sm md:grid-cols-3">
                                <div>
                                    <span className="text-muted-foreground">
                                        Submission Window
                                    </span>

                                    <p className="mt-1 font-medium">
                                        {formatDate(
                                            reportingPeriod.period_start,
                                        )}{' '}
                                        –{' '}
                                        {formatDate(reportingPeriod.period_end)}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">
                                        Late Submission Window
                                    </span>

                                    <p className="mt-1 font-medium">
                                        {formatDate(
                                            reportingPeriod.late_submission_start,
                                        )}{' '}
                                        –{' '}
                                        {formatDate(
                                            reportingPeriod.late_submission_end,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">
                                        Selected Period
                                    </span>

                                    <p className="mt-1 font-medium">
                                        {formatDate(
                                            reportingPeriod.period_start,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Total
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {summary.total}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Expected submissions
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Submitted
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {summary.submitted}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Completed
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Pending
                            </p>

                            <p className="mt-2 text-3xl font-bold text-yellow-600">
                                {summary.pending}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Not yet submitted
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                On Time
                            </p>

                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {summary.on_time}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Submitted on time
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Late
                            </p>

                            <p className="mt-2 text-3xl font-bold text-orange-600">
                                {summary.late}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Late submissions
                            </p>
                        </div>
                    </div>

                    {/* Overall Progress */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">
                                    Submission Compliance
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Overall submission completion for this
                                    reporting period.
                                </p>
                            </div>

                            <span className="text-2xl font-bold">
                                {summary.progress}%
                            </span>
                        </div>

                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${summary.progress}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Monitoring Table */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-5">
                            <h2 className="font-semibold">Submission Status</h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                All action plan submissions for the selected
                                reporting period.
                            </p>
                        </div>

                        {rows.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="font-medium">
                                    No action plans found.
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    There are no responsible units to monitor
                                    for this strategic plan.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40 text-left">
                                            <th className="px-5 py-3 font-medium">
                                                Action Plan
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                KPI
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Responsible Unit
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Status
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Timeliness
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Submitted By
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Submitted At
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Attachments
                                            </th>

                                            <th className="px-5 py-3 font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rows.map((row) => (
                                            <tr
                                                key={`${row.action_plan_id}-${row.organizational_unit.id}`}
                                                className="border-b last:border-0"
                                            >
                                                {/* Action Plan */}
                                                <td className="max-w-xs px-5 py-4 align-top">
                                                    <p className="font-medium">
                                                        {row.action_plan_title}
                                                    </p>
                                                </td>

                                                {/* KPI */}
                                                <td className="px-5 py-4 align-top">
                                                    <p className="font-medium">
                                                        {row.kpi.code}
                                                    </p>

                                                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                                                        {row.kpi.name}
                                                    </p>
                                                </td>

                                                {/* Unit */}
                                                <td className="px-5 py-4 align-top">
                                                    <p className="font-medium">
                                                        {
                                                            row
                                                                .organizational_unit
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {
                                                            row
                                                                .organizational_unit
                                                                .code
                                                        }
                                                    </p>
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4 align-top">
                                                    {row.submitted ? (
                                                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                            Submitted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Timeliness */}
                                                <td className="px-5 py-4 align-top">
                                                    {row.submission ? (
                                                        row.submission
                                                            .timeliness ===
                                                        'on_time' ? (
                                                            <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                                                On Time
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                                                                Late
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Submitted By */}
                                                <td className="px-5 py-4 align-top">
                                                    {row.submission
                                                        ?.submitted_by ?? (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Submitted At */}
                                                <td className="px-5 py-4 align-top whitespace-nowrap">
                                                    {row.submission ? (
                                                        formatDateTime(
                                                            row.submission
                                                                .submitted_at,
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Attachments */}
                                                <td className="px-5 py-4 align-top">
                                                    {row.submission ? (
                                                        <span>
                                                            {
                                                                row.submission
                                                                    .attachments_count
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="px-5 py-4 align-top">
                                                    <Link
                                                        href={`/action-plans/${row.action_plan_id}?reporting_period_id=${reportingPeriod.id}`}
                                                        className="rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition hover:bg-muted"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
