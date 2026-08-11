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

export default function UnitSubmissionsHistory({ actionPlan, submissions }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-5xl mx-auto space-y-6">
      <Head title={`Submission History - ${actionPlan.title}`} />

      <div>
        <Link
          href={route('my-unit.action-plans')}
          className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-3"
        >
          &larr; Back to Action Plans
        </Link>
        <span className="block text-xs uppercase tracking-wider text-emerald-400 font-medium">{actionPlan.kpi_code} — {actionPlan.kpi_name}</span>
        <h1 className="text-2xl font-bold text-white mt-0.5">{actionPlan.title}</h1>
      </div>

      <div className="space-y-4">
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <div key={sub.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{sub.period_label}</h3>
                  <p className="text-xs text-slate-400">Submitted by {sub.submitted_by} on {sub.submitted_at}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-xs rounded-full border font-medium ${
                    sub.timeliness === 'on_time'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {sub.timeliness === 'on_time' ? 'On Time' : 'Late'}
                  </span>
                </div>
              </div>

              {sub.comment ? (
                <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 whitespace-pre-line">
                  {sub.comment}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">No remarks provided.</p>
              )}

              {sub.attachments.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {sub.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.download_url}
                        className="inline-flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 text-emerald-400 px-3 py-2 rounded-lg border border-slate-800 transition-colors"
                      >
                        📎 <span className="truncate max-w-xs">{att.original_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            No historical submissions found for this action plan.
          </div>
        )}
      </div>
    </div>
  );
}
