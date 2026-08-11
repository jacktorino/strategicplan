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
    attachments: Array<{ id: number; original_name: string; download_url: string }>;
  } | null;
}

export default function UnitSubmit({ actionPlanUnit, reportingPeriod, existingSubmission }: Props) {
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
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-4xl mx-auto space-y-6">
      <Head title={`Submit Evidence - ${actionPlanUnit.title}`} />

      <div>
        <Link
          href={route('my-unit.action-plans')}
          className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-3"
        >
          &larr; Back to Action Plans
        </Link>
        <h1 className="text-2xl font-bold text-white">Submit Action Plan Evidence</h1>
        <p className="text-xs text-slate-400 mt-1">
          Period: {reportingPeriod.period_start} – {reportingPeriod.period_end}
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="text-xs font-semibold text-emerald-400">{actionPlanUnit.kpi_code} — {actionPlanUnit.kpi_name}</div>
        <h2 className="text-lg font-bold text-slate-100">{actionPlanUnit.title}</h2>
        {actionPlanUnit.description && (
          <p className="text-sm text-slate-400">{actionPlanUnit.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-2">
            Remarks / Comments
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            placeholder="Add any relevant submission details or progress updates..."
            value={data.comment}
            onChange={(e) => setData('comment', e.target.value)}
          />
          {errors.comment && <p className="text-xs text-rose-400 mt-1">{errors.comment}</p>}
        </div>

        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">
            Upload Document Attachment <span className="text-slate-500">(PDF, DOC, XLS, Images up to 10MB)</span>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer cursor-pointer border border-slate-800 rounded-lg bg-slate-950 p-1.5"
          />
          {errors.file && <p className="text-xs text-rose-400 mt-1">{errors.file}</p>}

          {progress && (
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
            </div>
          )}
        </div>

        {existingSubmission?.attachments && existingSubmission.attachments.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Uploaded Attachments:</h4>
            <ul className="space-y-1">
              {existingSubmission.attachments.map((att) => (
                <li key={att.id} className="text-xs flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-300 truncate">{att.original_name}</span>
                  <a href={att.download_url} className="text-emerald-400 hover:underline">Download</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            href={route('my-unit.action-plans')}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md disabled:opacity-50"
          >
            {processing ? 'Submitting...' : 'Confirm & Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
