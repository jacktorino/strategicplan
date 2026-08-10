import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type StrategicPlan = {
    id: number;
    name: string;
    academic_year: string;
};

type Props = {
    strategicPlan: StrategicPlan;
};

export default function Create({ strategicPlan }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        period_start: '',
        period_end: '',
        late_submission_start: '',
        late_submission_end: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(`/strategic-plans/${strategicPlan.id}/reporting-periods`);
    };

    return (
        <>
            <Head title="Create Reporting Period" />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-3xl space-y-8 p-6">
                    {/* Header */}
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {strategicPlan.academic_year}
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Create Reporting Period
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Create a submission cycle for{' '}
                            <span className="font-medium text-foreground">
                                {strategicPlan.name}
                            </span>
                            .
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
                    >
                        {/* Regular Submission Window */}
                        <div>
                            <div className="mb-4">
                                <h2 className="font-semibold">
                                    Submission Window
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Users can submit normally during this
                                    period.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                {/* Period Start */}
                                <div>
                                    <label
                                        htmlFor="period_start"
                                        className="text-sm font-medium"
                                    >
                                        Period Start
                                    </label>

                                    <input
                                        id="period_start"
                                        type="date"
                                        value={data.period_start}
                                        onChange={(event) =>
                                            setData(
                                                'period_start',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    {errors.period_start && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.period_start}
                                        </p>
                                    )}
                                </div>

                                {/* Period End */}
                                <div>
                                    <label
                                        htmlFor="period_end"
                                        className="text-sm font-medium"
                                    >
                                        Period End
                                    </label>

                                    <input
                                        id="period_end"
                                        type="date"
                                        value={data.period_end}
                                        onChange={(event) =>
                                            setData(
                                                'period_end',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    {errors.period_end && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.period_end}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Late Submission Window */}
                        <div className="border-t pt-6">
                            <div className="mb-4">
                                <h2 className="font-semibold">
                                    Late Submission Window
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Users can still submit during this period,
                                    but their submission will be marked as late.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                {/* Late Start */}
                                <div>
                                    <label
                                        htmlFor="late_submission_start"
                                        className="text-sm font-medium"
                                    >
                                        Late Submission Start
                                    </label>

                                    <input
                                        id="late_submission_start"
                                        type="date"
                                        value={data.late_submission_start}
                                        onChange={(event) =>
                                            setData(
                                                'late_submission_start',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    {errors.late_submission_start && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.late_submission_start}
                                        </p>
                                    )}
                                </div>

                                {/* Late End */}
                                <div>
                                    <label
                                        htmlFor="late_submission_end"
                                        className="text-sm font-medium"
                                    >
                                        Late Submission End
                                    </label>

                                    <input
                                        id="late_submission_end"
                                        type="date"
                                        value={data.late_submission_end}
                                        onChange={(event) =>
                                            setData(
                                                'late_submission_end',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    {errors.late_submission_end && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.late_submission_end}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Information */}
                        <div className="rounded-lg border bg-muted/40 p-4">
                            <p className="text-sm font-medium">
                                How the submission status works
                            </p>

                            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                <p>
                                    <span className="font-medium text-green-600">
                                        Open
                                    </span>{' '}
                                    — submissions are considered on time.
                                </p>

                                <p>
                                    <span className="font-medium text-orange-600">
                                        Late
                                    </span>{' '}
                                    — submissions are accepted but marked as
                                    late.
                                </p>

                                <p>
                                    <span className="font-medium text-muted-foreground">
                                        Closed
                                    </span>{' '}
                                    — submissions are no longer accepted.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t pt-5">
                            <Link
                                href={`/strategic-plans/${strategicPlan.id}/reporting-periods`}
                                className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Reporting Period'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
