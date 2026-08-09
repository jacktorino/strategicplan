import { Head, Link } from '@inertiajs/react';

type StrategicPlan = {
    id: number;
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    kras_count: number;
    reporting_periods_count: number;
};

type Props = {
    strategicPlans: StrategicPlan[];
};

export default function Index({ strategicPlans }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Strategic Plans" />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl space-y-8 p-6">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Strategic Planning
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Strategic Plans
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            View and manage the university's strategic plans.
                        </p>
                    </div>

                    {strategicPlans.length === 0 ? (
                        <div className="rounded-xl border bg-card p-10 text-center shadow-sm">
                            <h2 className="font-semibold">
                                No strategic plans found
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                There are currently no strategic plans
                                available.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {strategicPlans.map((plan) => (
                                <Link
                                    key={plan.id}
                                    href={`/strategic-plans/${plan.id}`}
                                    className="group rounded-xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {plan.academic_year}
                                            </p>

                                            <h2 className="mt-1 text-xl font-semibold group-hover:text-primary">
                                                {plan.name}
                                            </h2>
                                        </div>

                                        <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                            {plan.kras_count} KRA
                                            {plan.kras_count !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <span>
                                        {plan.reporting_periods_count} reporting
                                        periods
                                    </span>

                                    <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
                                        <div className="flex justify-between gap-4">
                                            <span>Start</span>

                                            <span className="font-medium text-foreground">
                                                {formatDate(plan.start_date)}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex justify-between gap-4">
                                            <span>End</span>

                                            <span className="font-medium text-foreground">
                                                {formatDate(plan.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
