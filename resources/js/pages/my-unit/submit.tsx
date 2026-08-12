import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    actionPlanUnit: {
        id: number;
        action_plan_id: number;
        title: string;
        description: string | null;
        kpi_code: string;
        kpi_name: string;
    };
    reportingPeriod: {
        id: number;
        period_start: string;
        period_end: string;
    };
    existingSubmission?: {
        id: number;
        comment: string | null;
        attachments: Array<{
            id: number;
            original_name: string;
            download_url: string;
        }>;
    } | null;
}

export default function UnitSubmit({
    actionPlanUnit,
    reportingPeriod,
    existingSubmission,
}: Props) {
    const { data, setData, post, processing, errors, progress } = useForm({
        comment: existingSubmission?.comment || '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            route('action-plan-submissions.store', {
                actionPlanUnit: actionPlanUnit.id,
                reportingPeriod: reportingPeriod.id,
            }),
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="mx-auto min-h-screen max-w-4xl space-y-6 bg-slate-950 p-6 text-slate-100">
            <Head title={`Submit Evidence - ${actionPlanUnit.title}`} />

            <div>
                <Link
                    href={route('my-unit.action-plans')}
                    className="mb-3 inline-flex items-center text-xs text-slate-400 transition-colors hover:text-emerald-400"
                >
                    &larr; Back to Action Plans
                </Link>
                <h1 className="text-2xl font-bold text-white">
                    Submit Action Plan Evidence
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                    Period: {reportingPeriod.period_start} –{' '}
                    {reportingPeriod.period_end}
                </p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs font-semibold text-emerald-400">
                    {actionPlanUnit.kpi_code} — {actionPlanUnit.kpi_name}
                </div>
                <h2 className="text-lg font-bold text-slate-100">
                    {actionPlanUnit.title}
                </h2>
                {actionPlanUnit.description && (
                    <p className="text-sm text-slate-400">
                        {actionPlanUnit.description}
                    </p>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-6"
            >
                <div>
                    <label
                        htmlFor="comment"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Remarks / Comments
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Add any relevant submission details or progress updates..."
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                    />
                    {errors.comment && (
                        <p className="mt-1 text-xs text-rose-400">
                            {errors.comment}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="file-upload"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Upload Document Attachment{' '}
                        <span className="text-slate-500">
                            (PDF, DOC, XLS, Images up to 10MB)
                        </span>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={(e) =>
                            setData(
                                'file',
                                e.target.files ? e.target.files[0] : null,
                            )
                        }
                        className="block w-full cursor-pointer rounded-lg border border-slate-800 bg-slate-950 p-1.5 text-sm text-slate-400 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-500"
                    />
                    {errors.file && (
                        <p className="mt-1 text-xs text-rose-400">
                            {errors.file}
                        </p>
                    )}

                    {progress && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-1.5 bg-emerald-500 transition-all duration-300"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    )}
                </div>

                {existingSubmission?.attachments &&
                    existingSubmission.attachments.length > 0 && (
                        <div className="border-t border-slate-800 pt-2">
                            <h4 className="mb-2 text-xs font-semibold text-slate-400 uppercase">
                                Uploaded Attachments:
                            </h4>
                            <ul className="space-y-1">
                                {existingSubmission.attachments.map((att) => (
                                    <li
                                        key={att.id}
                                        className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 p-2 text-xs"
                                    >
                                        <span className="truncate text-slate-300">
                                            {att.original_name}
                                        </span>
                                        <a
                                            href={att.download_url}
                                            className="text-emerald-400 hover:underline"
                                        >
                                            Download
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                    <Link
                        href={route('my-unit.action-plans')}
                        className="px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-emerald-500 disabled:opacity-50"
                    >
                        {processing ? 'Submitting...' : 'Confirm & Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
