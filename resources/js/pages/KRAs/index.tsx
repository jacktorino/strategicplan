import { Head } from '@inertiajs/react';

export default function KrasIndex() {
    return (
        <>
            <Head title="Key Result Areas (KRAs)" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Key Result Areas (KRAs)</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    KRA management view.
                </div>
            </div>
        </>
    );
}
