import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, Download, Paperclip, Send } from 'lucide-react';
import { useState } from 'react';

interface SubmissionAttachment {
    id: number;
    original_name: string;
    mime_type: string;
    size: number;
    download_url: string;
}

interface ResponsibleUnit {
    id: number;
    action_plan_unit_id: number;
    code: string;
    name: string;
    submitted: boolean;
    submission: {
        id: number;
        status: string;
        timeliness: string;
        comment: string;
        submitted_at: string;
        submitted_by: string;
        attachments: SubmissionAttachment[];
    } | null;
}

interface Props {
    actionPlan: {
        id: number;
        title: string;
        description: string;
        kpi: { id: number; code: string; name: string };
        reporting_period: {
            id: number;
            period_start: string;
            period_end: string;
            late_submission_start: string;
            late_submission_end: string;
        } | null;
        reporting_periods: Array<{
            id: number;
            period_start: string;
            period_end: string;
        }>;
        progress: number;
        responsible_units: ResponsibleUnit[];
    };
}

export default function ActionPlansShow({ actionPlan }: Props) {
    const [selectedUnit, setSelectedUnit] = useState<ResponsibleUnit | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        comment: '',
        file: null as File | null,
    });

    const handlePeriodChange = (periodId: string) => {
        router.get(`/action-plans/${actionPlan.id}`, { reporting_period_id: periodId }, { preserveState: true });
    };

    const handleSubmissionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUnit || !actionPlan.reporting_period) return;

        post(`/action-plan-units/${selectedUnit.action_plan_unit_id}/periods/${actionPlan.reporting_period.id}/submissions`, {
            onSuccess: () => {
                reset();
                setSelectedUnit(null);
            },
        });
    };

    return (
        <>
            <Head title={`Action Plan - ${actionPlan.title}`} />
            <div className="flex flex-col gap-6 p-6">
                <Link href="/my-sub-kra/action-plans" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" /> Back to Action Plans
                </Link>

                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">KPI: {actionPlan.kpi.code}</span>
                            <span className="text-xs text-muted-foreground">{actionPlan.kpi.name}</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">{actionPlan.title}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{actionPlan.description || 'No description provided.'}</p>
                    </div>

                    {actionPlan.reporting_periods.length > 0 && (
                        <div className="min-w-[220px]">
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Reporting Period</label>
                            <select
                                value={actionPlan.reporting_period?.id || ''}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                            >
                                {actionPlan.reporting_periods.map((period) => (
                                    <option key={period.id} value={period.id}>
                                        {period.period_start} to {period.period_end}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b bg-muted/40 p-4">
                        <h2 className="text-lg font-semibold">Responsible Units & Submissions</h2>
                        <span className="text-xs text-muted-foreground">Progress: {actionPlan.progress}%</span>
                    </div>

                    <div className="divide-y border-sidebar-border/50">
                        {actionPlan.responsible_units.length > 0 ? (
                            actionPlan.responsible_units.map((unit) => (
                                <div key={unit.id} className="p-6 transition-colors hover:bg-muted/10">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-semibold">{unit.name}</h3>
                                                <span className="text-xs text-muted-foreground">({unit.code})</span>
                                            </div>
                                            {unit.submitted ? (
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                                                        <CheckCircle2 className="size-4" /> Submitted by {unit.submission?.submitted_by} on {unit.submission?.submitted_at}
                                                    </div>
                                                    {unit.submission?.comment && (
                                                        <p className="mt-2 rounded-lg border bg-muted/50 p-3 text-sm text-foreground/90">{unit.submission.comment}</p>
                                                    )}
                                                    {unit.submission?.attachments && unit.submission.attachments.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {unit.submission.attachments.map((att) => (
                                                                <a
                                                                    key={att.id}
                                                                    href={att.download_url}
                                                                    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-accent"
                                                                >
                                                                    <Paperclip className="size-3" />
                                                                    <span>{att.original_name}</span>
                                                                    <Download className="size-3 text-muted-foreground" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-1 flex items-center gap-2 text-xs font-medium text-amber-600">
                                                    <Clock className="size-4" /> Pending Submission
                                                </div>
                                            )}
                                        </div>

                                        {!unit.submitted && actionPlan.reporting_period && (
                                            <button
                                                onClick={() => setSelectedUnit(unit)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
                                            >
                                                <Send className="size-3.5" /> Submit Progress
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">No responsible units assigned to this action plan yet.</div>
                        )}
                    </div>
                </div>

                {selectedUnit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg">
                            <h3 className="mb-1 text-lg font-bold">Submit Progress for {selectedUnit.name}</h3>
                            <p className="mb-4 text-xs text-muted-foreground">Upload proof documents and optional remarks for this period.</p>

                            <form onSubmit={handleSubmissionSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Comment / Accomplishment Notes</label>
                                    <textarea
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                        placeholder="Summarize actions taken during this period..."
                                    />
                                    {errors.comment && <p className="mt-1 text-xs text-destructive">{errors.comment}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Attachment File (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                        className="mt-1 w-full text-xs text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                                    />
                                    {errors.file && <p className="mt-1 text-xs text-destructive">{errors.file}</p>}
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUnit(null)}
                                        className="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Confirm Submission'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}