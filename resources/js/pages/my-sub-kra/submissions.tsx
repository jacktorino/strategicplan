import { Head } from '@inertiajs/react';

export default function OwnerSubmissions() {
    return (
        <>
            <Head title="Submission Verification" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Submission Verification</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    Sub-KRA Owner verification view.
                </div>
            </div>
        </>
    );
}
