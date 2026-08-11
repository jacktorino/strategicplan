import { Head } from '@inertiajs/react';

export default function ReportingPeriodsIndex() {
    return (
        <>
            <Head title="Reporting Periods" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Reporting Periods</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    Reporting period management view.
                </div>
            </div>
        </>
    );
}
