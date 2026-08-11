import { Head } from '@inertiajs/react';

export default function SubmissionsManage() {
    return (
        <>
            <Head title="Submission Approvals" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Submission Approvals</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    Submission review & approvals view.
                </div>
            </div>
        </>
    );
}
