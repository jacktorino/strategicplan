import { Head } from '@inertiajs/react';

export default function SubKrasIndex() {
    return (
        <>
            <Head title="Sub-KRAs & Owners" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Sub-KRAs & Owners</h1>
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    Sub-KRA management view.
                </div>
            </div>
        </>
    );
}
