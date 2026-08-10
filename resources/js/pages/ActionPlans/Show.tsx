import { Head, router } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';

import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Attachment = {
    id: number;
    original_name: string;
    mime_type: string;
    size: number;
    download_url: string;
};

type Submission = {
    id: number;
    status: string;
    timeliness: string;
    comment: string | null;
    submitted_at: string;
    submitted_by: string | null;
    attachments: Attachment[];
};

type ResponsibleUnit = {
    id: number;
    action_plan_unit_id: number;
    code: string;
    name: string;
    submitted: boolean;
    submission: Submission | null;
};

type ReportingPeriod = {
    id: number;
    period_start: string;
    period_end: string;
    late_submission_start: string;
    late_submission_end: string;
};

type ActionPlan = {
    id: number;
    title: string;
    description: string | null;

    kpi: {
        id: number;
        code: string;
        name: string;
    };

    reporting_period: ReportingPeriod;
    reporting_periods: ReportingPeriod[];
    progress: number;
    responsible_units: ResponsibleUnit[];
};

type Props = {
    actionPlan: ActionPlan;
};

export default function Show({ actionPlan }: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState(
        actionPlan.reporting_period.id.toString(),
    );

    const [comment, setComment] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const [submittingUnitId, setSubmittingUnitId] = useState<number | null>(
        null,
    );

    const [attachmentToDelete, setAttachmentToDelete] =
        useState<Attachment | null>(null);

    const [editingSubmissionId, setEditingSubmissionId] = useState<
        number | null
    >(null);

    const [editingComment, setEditingComment] = useState('');

    const [error, setError] = useState<string | null>(null);

    const attachmentInputRefs = useRef<
        Record<number, HTMLInputElement | null>
    >({});

    const proofInputRefs = useRef<
        Record<number, HTMLInputElement | null>
    >({});

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const changePeriod = (periodId: string) => {
        setSelectedPeriod(periodId);

        setComment('');
        setFile(null);
        setError(null);

        router.get(
            `/action-plans/${actionPlan.id}`,
            {
                reporting_period_id: periodId,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const submitUnit = (
        event: FormEvent<HTMLFormElement>,
        unit: ResponsibleUnit,
    ) => {
        event.preventDefault();

        setError(null);

        setSubmittingUnitId(unit.action_plan_unit_id);

        const formData = new FormData();

        if (comment.trim()) {
            formData.append('comment', comment.trim());
        }

        if (file) {
            formData.append('file', file);
        }

        router.post(
            `/action-plan-units/${unit.action_plan_unit_id}/reporting-periods/${actionPlan.reporting_period.id}/submit`,
            formData,
            {
                preserveScroll: true,
                forceFormData: true,

                onSuccess: () => {
                    setComment('');
                    setFile(null);

                    const input =
                        proofInputRefs.current[
                            unit.action_plan_unit_id
                        ];

                    if (input) {
                        input.value = '';
                    }

                    toast.success('Submission successful', {
                        description:
                            'Your action plan submission has been recorded.',
                    });

                    router.reload({
                        only: ['actionPlan'],
                    });
                },

                onError: (errors) => {
                    const message =
                        errors.comment ??
                        errors.file ??
                        errors.submission ??
                        errors.organizational_unit ??
                        errors.reporting_period ??
                        errors.action_plan ??
                        'Unable to submit the action plan.';

                    setError(message);

                    toast.error('Submission failed', {
                        description: message,
                    });
                },

                onFinish: () => {
                    setSubmittingUnitId(null);
                },
            },
        );
    };

    return (
        <>
            <Head title={actionPlan.title} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-6xl space-y-6 p-6">
                    {/* Header */}
                    <div>
                        <div className="mb-2 text-sm text-muted-foreground">
                            {actionPlan.kpi.code}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            {actionPlan.title}
                        </h1>

                        {actionPlan.description && (
                            <p className="mt-2 text-muted-foreground">
                                {actionPlan.description}
                            </p>
                        )}
                    </div>

                    {/* KPI + Reporting Period */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                KPI
                            </p>

                            <p className="mt-1 font-semibold">
                                {actionPlan.kpi.name}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {actionPlan.kpi.code}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <label
                                htmlFor="reporting-period"
                                className="text-sm text-muted-foreground"
                            >
                                Reporting Period
                            </label>

                            <select
                                id="reporting-period"
                                value={selectedPeriod}
                                onChange={(event) =>
                                    changePeriod(event.target.value)
                                }
                                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
                            >
                                {actionPlan.reporting_periods.map(
                                    (period) => (
                                        <option
                                            key={period.id}
                                            value={period.id}
                                        >
                                            {formatDate(
                                                period.period_start,
                                            )}
                                            {' – '}
                                            {formatDate(
                                                period.period_end,
                                            )}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">
                                    Submission Progress
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Responsible units that have submitted
                                </p>
                            </div>

                            <div className="text-3xl font-bold">
                                {actionPlan.progress}%
                            </div>
                        </div>

                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${actionPlan.progress}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Responsible Units */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Responsible Units
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Submission status for the selected reporting
                                period.
                            </p>
                        </div>

                        {actionPlan.responsible_units.map((unit) => (
                            <div
                                key={unit.action_plan_unit_id}
                                className="rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold">
                                                {unit.name}
                                            </h3>

                                            <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                                {unit.code}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        {unit.submitted ? (
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                                Submitted
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Existing Submission */}
                                {unit.submission && (
                                    <div className="mt-5 space-y-4 border-t pt-4">
                                        <div className="grid gap-4 text-sm md:grid-cols-3">
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Submitted By
                                                </p>

                                                <p className="font-medium">
                                                    {
                                                        unit.submission
                                                            .submitted_by
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">
                                                    Submitted At
                                                </p>

                                                <p className="font-medium">
                                                    {formatDate(
                                                        unit.submission
                                                            .submitted_at,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">
                                                    Timeliness
                                                </p>

                                                <p className="font-medium capitalize">
                                                    {
                                                        unit.submission
                                                            .timeliness
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        {unit.submission.comment && (
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">
                                                        Comment
                                                    </p>

                                                    {editingSubmissionId !==
                                                        unit.submission
                                                            .id && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingSubmissionId(
                                                                    unit
                                                                        .submission!
                                                                        .id,
                                                                );

                                                                setEditingComment(
                                                                    unit
                                                                        .submission!
                                                                        .comment ??
                                                                        '',
                                                                );
                                                            }}
                                                            className="text-sm font-medium text-primary hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </div>

                                                {editingSubmissionId ===
                                                unit.submission.id ? (
                                                    <div className="mt-2 space-y-3">
                                                        <textarea
                                                            value={
                                                                editingComment
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                setEditingComment(
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={4}
                                                            maxLength={5000}
                                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                        />

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    router.patch(
                                                                        `/action-plan-submissions/${unit.submission!.id}`,
                                                                        {
                                                                            comment:
                                                                                editingComment ||
                                                                                null,
                                                                        },
                                                                        {
                                                                            preserveScroll:
                                                                                true,

                                                                            onSuccess:
                                                                                () => {
                                                                                    setEditingSubmissionId(
                                                                                        null,
                                                                                    );

                                                                                    setEditingComment(
                                                                                        '',
                                                                                    );

                                                                                    toast.success(
                                                                                        'Comment updated',
                                                                                    );
                                                                                },

                                                                            onError:
                                                                                (
                                                                                    errors,
                                                                                ) => {
                                                                                    setError(
                                                                                        errors.comment ??
                                                                                            'Unable to update the comment.',
                                                                                    );
                                                                                },
                                                                        },
                                                                    );
                                                                }}
                                                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingSubmissionId(
                                                                        null,
                                                                    );

                                                                    setEditingComment(
                                                                        '',
                                                                    );
                                                                }}
                                                                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                editingComment.length
                                                            }
                                                            /5000
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="mt-1 text-sm">
                                                        {
                                                            unit.submission
                                                                .comment
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Attachments */}
                                        {unit.submission.attachments.length >
                                            0 && (
                                            <div>
                                                <p className="mb-2 text-sm font-medium">
                                                    Attachments
                                                </p>

                                                <div className="space-y-2">
                                                    {unit.submission.attachments.map(
                                                        (
                                                            attachment,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    attachment.id
                                                                }
                                                                className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                                            >
                                                                <a
                                                                    href={
                                                                        attachment.download_url
                                                                    }
                                                                    className="flex min-w-0 flex-1 items-center justify-between transition hover:opacity-80"
                                                                >
                                                                    <span className="truncate font-medium">
                                                                        {
                                                                            attachment.original_name
                                                                        }
                                                                    </span>

                                                                    <span className="ml-4 shrink-0 text-muted-foreground">
                                                                        {formatFileSize(
                                                                            attachment.size,
                                                                        )}
                                                                    </span>
                                                                </a>

                                                                <AlertDialog
                                                                    open={
                                                                        attachmentToDelete?.id ===
                                                                        attachment.id
                                                                    }
                                                                    onOpenChange={(
                                                                        open,
                                                                    ) => {
                                                                        if (
                                                                            !open
                                                                        ) {
                                                                            setAttachmentToDelete(
                                                                                null,
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setAttachmentToDelete(
                                                                                    attachment,
                                                                                )
                                                                            }
                                                                            className="ml-4 shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </AlertDialogTrigger>

                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Delete
                                                                                attachment?
                                                                            </AlertDialogTitle>

                                                                            <AlertDialogDescription>
                                                                                Are
                                                                                you
                                                                                sure
                                                                                you
                                                                                want
                                                                                to
                                                                                delete{' '}
                                                                                <span className="font-medium text-foreground">
                                                                                    {
                                                                                        attachment.original_name
                                                                                    }
                                                                                </span>
                                                                                ?
                                                                                This
                                                                                action
                                                                                cannot
                                                                                be
                                                                                undone.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>

                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>
                                                                                Cancel
                                                                            </AlertDialogCancel>

                                                                            <AlertDialogAction
                                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                variant="destructive"
                                                                                onClick={() => {
                                                                                    router.delete(
                                                                                        `/submission-attachments/${attachment.id}`,
                                                                                        {
                                                                                            preserveScroll:
                                                                                                true,

                                                                                            onSuccess:
                                                                                                () => {
                                                                                                    setAttachmentToDelete(
                                                                                                        null,
                                                                                                    );

                                                                                                    toast.success(
                                                                                                        'Attachment deleted',
                                                                                                        {
                                                                                                            description:
                                                                                                                'The supporting document was deleted successfully.',
                                                                                                        },
                                                                                                    );
                                                                                                },

                                                                                            onError:
                                                                                                () => {
                                                                                                    toast.error(
                                                                                                        'Delete failed',
                                                                                                        {
                                                                                                            description:
                                                                                                                'Unable to delete the attachment.',
                                                                                                        },
                                                                                                    );
                                                                                                },
                                                                                        },
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add Supporting Document */}
                                        <form
                                            onSubmit={(event) => {
                                                event.preventDefault();

                                                const formData =
                                                    new FormData();

                                                const input =
                                                    event.currentTarget.elements.namedItem(
                                                        `attachment-${unit.action_plan_unit_id}`,
                                                    ) as HTMLInputElement;

                                                const selectedFile =
                                                    input.files?.[0];

                                                if (!selectedFile) {
                                                    toast.error(
                                                        'No file selected',
                                                        {
                                                            description:
                                                                'Please select a file.',
                                                        },
                                                    );

                                                    return;
                                                }

                                                formData.append(
                                                    'file',
                                                    selectedFile,
                                                );

                                                router.post(
                                                    `/action-plan-submissions/${unit.submission!.id}/attachments`,
                                                    formData,
                                                    {
                                                        preserveScroll: true,
                                                        forceFormData: true,

                                                        onSuccess: () => {
                                                            const input =
                                                                attachmentInputRefs
                                                                    .current[
                                                                    unit
                                                                        .action_plan_unit_id
                                                                ];

                                                            if (input) {
                                                                input.value =
                                                                    '';
                                                            }

                                                            toast.success(
                                                                'Attachment uploaded',
                                                                {
                                                                    description:
                                                                        'The supporting document was uploaded successfully.',
                                                                },
                                                            );
                                                        },

                                                        onError: (errors) => {
                                                            const message =
                                                                errors.file ??
                                                                'Unable to upload the attachment.';

                                                            toast.error(
                                                                'Upload failed',
                                                                {
                                                                    description:
                                                                        message,
                                                                },
                                                            );
                                                        },
                                                    },
                                                );
                                            }}
                                            className="mt-4 space-y-3"
                                        >
                                            <div>
                                                <label
                                                    htmlFor={`attachment-${unit.action_plan_unit_id}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Add Supporting Document
                                                </label>

                                                <input
                                                    ref={(element) => {
                                                        attachmentInputRefs.current[
                                                            unit.action_plan_unit_id
                                                        ] = element;
                                                    }}
                                                    id={`attachment-${unit.action_plan_unit_id}`}
                                                    name={`attachment-${unit.action_plan_unit_id}`}
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                                    className="mt-2 block w-full rounded-md border bg-background px-3 py-2 text-sm"
                                                />

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    PDF, JPG, PNG, DOC, DOCX,
                                                    XLS, or XLSX. Maximum 10
                                                    MB.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                            >
                                                Add Attachment
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Submission Form */}
                                {!unit.submitted && (
                                    <form
                                        onSubmit={(event) =>
                                            submitUnit(event, unit)
                                        }
                                        className="mt-5 space-y-4 border-t pt-5"
                                    >
                                        <div>
                                            <label
                                                htmlFor={`comment-${unit.action_plan_unit_id}`}
                                                className="text-sm font-medium"
                                            >
                                                Comment
                                            </label>

                                            <textarea
                                                id={`comment-${unit.action_plan_unit_id}`}
                                                value={comment}
                                                onChange={(event) =>
                                                    setComment(
                                                        event.target.value,
                                                    )
                                                }
                                                rows={4}
                                                maxLength={5000}
                                                placeholder="Enter a comment about this submission..."
                                                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                            />

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {comment.length}/5000
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor={`proof-${unit.action_plan_unit_id}`}
                                                className="text-sm font-medium"
                                            >
                                                Proof / Supporting Document
                                            </label>

                                            <input
                                                ref={(element) => {
                                                    proofInputRefs.current[
                                                        unit.action_plan_unit_id
                                                    ] = element;
                                                }}
                                                id={`proof-${unit.action_plan_unit_id}`}
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                                onChange={(event) =>
                                                    setFile(
                                                        event.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            />

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                PDF, JPG, PNG, DOC, DOCX, XLS,
                                                or XLSX. Maximum 10 MB.
                                            </p>
                                        </div>

                                        {file && (
                                            <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                                Selected:{' '}
                                                <span className="font-medium">
                                                    {file.name}
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={
                                                submittingUnitId ===
                                                unit.action_plan_unit_id
                                            }
                                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {submittingUnitId ===
                                            unit.action_plan_unit_id
                                                ? 'Submitting...'
                                                : 'Submit'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

