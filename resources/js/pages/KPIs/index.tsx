import { Head } from '@inertiajs/react';

export default function KpisIndex() {
    return (
        <>
            <Head title="KPI & Action Plan Setup" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">KPI & Action Plan Setup</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    KPI configuration view.
                </div>
            </div>
        </>
    );
}
