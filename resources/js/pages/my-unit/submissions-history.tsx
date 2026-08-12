import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface SubmissionHistoryRecord {
    id: number;
    period_label: string;
    status: string;
    timeliness: 'on_time' | 'late';
    comment: string | null;
    submitted_at: string;
    submitted_by: string;
    attachments: Array<{
        id: number;
        original_name: string;
        download_url: string;
    }>;
}

interface Props {
    actionPlan: {
        id: number;
        title: string;
        kpi_code: string;
        kpi_name: string;
    };
    submissions: SubmissionHistoryRecord[];
}

export default function UnitSubmissionsHistory({
    actionPlan,
    submissions,
}: Props) {
    return (
        <div className="mx-auto min-h-screen max-w-5xl space-y-6 bg-slate-950 p-6 text-slate-100">
            <Head title={`Submission History - ${actionPlan.title}`} />

            <div>
                <Link
                    href={route('my-unit.action-plans')}
                    className="mb-3 inline-flex items-center text-xs text-slate-400 transition-colors hover:text-emerald-400"
                >
                    &larr; Back to Action Plans
                </Link>
                <span className="block text-xs font-medium tracking-wider text-emerald-400 uppercase">
                    {actionPlan.kpi_code} — {actionPlan.kpi_name}
                </span>
                <h1 className="mt-0.5 text-2xl font-bold text-white">
                    {actionPlan.title}
                </h1>
            </div>

            <div className="space-y-4">
                {submissions.length > 0 ? (
                    submissions.map((sub) => (
                        <div
                            key={sub.id}
                            className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-200">
                                        {sub.period_label}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Submitted by {sub.submitted_by} on{' '}
                                        {sub.submitted_at}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                            sub.timeliness === 'on_time'
                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                        }`}
                                    >
                                        {sub.timeliness === 'on_time'
                                            ? 'On Time'
                                            : 'Late'}
                                    </span>
                                </div>
                            </div>

                            {sub.comment ? (
                                <p className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-3 text-sm whitespace-pre-line text-slate-300">
                                    {sub.comment}
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 italic">
                                    No remarks provided.
                                </p>
                            )}

                            {sub.attachments.length > 0 && (
                                <div className="pt-2">
                                    <h4 className="mb-2 text-xs font-semibold text-slate-400 uppercase">
                                        Attachments
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {sub.attachments.map((att) => (
                                            <a
                                                key={att.id}
                                                href={att.download_url}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-emerald-400 transition-colors hover:bg-slate-800"
                                            >
                                                📎{' '}
                                                <span className="max-w-xs truncate">
                                                    {att.original_name}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500">
                        No historical submissions found for this action plan.
                    </div>
                )}
            </div>
        </div>
    );
}
