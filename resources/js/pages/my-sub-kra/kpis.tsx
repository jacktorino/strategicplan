import { Head } from '@inertiajs/react';

export default function OwnerKpis() {
    return (
        <>
            <Head title="KPI Metrics Tracking" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">KPI Metrics Tracking</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    Sub-KRA Owner KPI tracking view.
                </div>
            </div>
        </>
    );
}
