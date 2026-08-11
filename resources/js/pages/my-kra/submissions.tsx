import { Head } from '@inertiajs/react';

export default function ChampionSubmissions() {
    return (
        <>
            <Head title="Unit Submissions Review" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Unit Submissions Review</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    KRA Champion submission review view.
                </div>
            </div>
        </>
    );
}
