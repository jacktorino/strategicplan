import { Head } from '@inertiajs/react';

export default function StrategicPlansIndex() {
    return (
        <>
            <Head title="Strategic Plans & Periods" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">
                    Strategic Plans & Periods
                </h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    Strategic plans management view.
                </div>
            </div>
        </>
    );
}
