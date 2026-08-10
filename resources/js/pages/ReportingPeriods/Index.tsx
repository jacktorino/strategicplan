
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type StrategicPlan = {
    id: number;
    name: string;
    academic_year: string;
};

type ReportingPeriod = {
    id: number;
    period_start: string;
    period_end: string;
    late_submission_start: string;
    late_submission_end: string;
    status: 'open' | 'closed';
};

type Props = {
    strategicPlan: StrategicPlan;
    reportingPeriods: ReportingPeriod[];
};

export default function Index({
    strategicPlan,
    reportingPeriods,
}: Props) {
    const [periodToDelete, setPeriodToDelete] =
        useState<ReportingPeriod | null>(null);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const deletePeriod = () => {
        if (!periodToDelete) {
            return;
        }

        router.delete(
            `/strategic-plans/${strategicPlan.id}/reporting-periods/${periodToDelete.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPeriodToDelete(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Reporting Periods" />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-6xl space-y-8 p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {strategicPlan.academic_year}
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Reporting Periods
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Manage the submission cycles for{' '}
                                <span className="font-medium text-foreground">
                                    {strategicPlan.name}
                                </span>
                                .
                            </p>
                        </div>

                        <Link
                            href={`/strategic-plans/${strategicPlan.id}/reporting-periods/create`}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Add Reporting Period
                        </Link>
                    </div>

                    {/* Empty State */}
                    {reportingPeriods.length === 0 ? (
                        <div className="rounded-xl border bg-card p-10 text-center shadow-sm">
                            <h2 className="font-semibold">
                                No reporting periods
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Create a reporting period to begin
                                accepting submissions.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reportingPeriods.map((period) => (
                                <div
                                    key={period.id}
                                    className="rounded-xl border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="font-semibold">
                                                    {formatDate(
                                                        period.period_start,
                                                    )}{' '}
                                                    –{' '}
                                                    {formatDate(
                                                        period.period_end,
                                                    )}
                                                </h2>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        period.status ===
                                                        'open'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {period.status ===
                                                    'open'
                                                        ? 'Open'
                                                        : 'Closed'}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Regular Submission
                                                    </p>

                                                    <p className="mt-1 font-medium">
                                                        {formatDate(
                                                            period.period_start,
                                                        )}{' '}
                                                        –{' '}
                                                        {formatDate(
                                                            period.period_end,
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Late Submission
                                                    </p>

                                                    <p className="mt-1 font-medium">
                                                        {formatDate(
                                                            period.late_submission_start,
                                                        )}{' '}
                                                        –{' '}
                                                        {formatDate(
                                                            period.late_submission_end,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <Link
                                                href={`/strategic-plans/${strategicPlan.id}/reporting-periods/${period.id}/edit`}
                                                className="rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPeriodToDelete(period)
                                                }
                                                className="rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog
                open={periodToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPeriodToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete reporting period?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete this reporting
                            period? Any submissions associated with this
                            reporting period may also be deleted. This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            onClick={deletePeriod}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

