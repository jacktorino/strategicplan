import { Head } from '@inertiajs/react';

export default function ChampionKpis() {
    return (
        <>
            <Head title="KPI Performance" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">KPI Performance</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    KRA Champion KPI performance view.
                </div>
            </div>
        </>
    );
}
