import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface ReportingPeriod {
    id: number;
    period_start: string;
    period_end: string;
}

interface ActionPlanUnitItem {
    id: number;
    action_plan_id: number;
    title: string;
    description: string | null;
    kpi_code: string;
    kpi_name: string;
    status: 'pending' | 'submitted' | 'late';
    submitted_at?: string;
    submission_id?: number;
}

interface PageProps {
    unit?: { id: number; code: string; name: string } | null;
    reportingPeriod?: ReportingPeriod | null;
    reportingPeriods?: ReportingPeriod[];
    actionPlans?: ActionPlanUnitItem[];
}

export default function UnitActionPlans({
    unit,
    reportingPeriod,
    reportingPeriods = [],
    actionPlans = [],
}: PageProps) {
    const handlePeriodChange = (periodId: string) => {
        router.get(
            route('my-unit.action-plans'),
            { reporting_period_id: periodId },
            { preserveState: true },
        );
    };

    const getStatusBadge = (status: ActionPlanUnitItem['status']) => {
        switch (status) {
            case 'submitted':
                return (
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        Submitted
                    </span>
                );
            case 'late':
                return (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                        Late Submission
                    </span>
                );
            default:
                return (
                    <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-400">
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen space-y-6 bg-slate-950 p-6 text-slate-100">
            <Head title={`Unit Action Plans - ${unit?.name ?? 'My Unit'}`} />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <span className="text-xs font-medium tracking-wider text-emerald-400 uppercase">
                        {unit?.code ? `${unit.code} - ` : ''}
                        {unit?.name ?? 'Unit Dashboard'}
                    </span>
                    <h1 className="mt-0.5 text-2xl font-bold text-white">
                        Assigned Action Plans
                    </h1>
                </div>

                {/* Reporting Period Filter */}
                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/80 p-2">
                    <label
                        htmlFor="period-select"
                        className="pl-2 text-xs font-medium text-slate-400"
                    >
                        Period:
                    </label>
                    <select
                        id="period-select"
                        className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                        value={reportingPeriod?.id ?? ''}
                        onChange={(e) => handlePeriodChange(e.target.value)}
                    >
                        {reportingPeriods.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.period_start} to {p.period_end}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Plans Table */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="border-b border-slate-800 bg-slate-900 text-xs text-slate-400 uppercase">
                            <tr>
                                <th className="px-4 py-3.5">KPI</th>
                                <th className="px-4 py-3.5">
                                    Action Plan Title
                                </th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {actionPlans.length > 0 ? (
                                actionPlans.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-slate-800/30"
                                    >
                                        <td className="px-4 py-4 font-medium whitespace-nowrap text-emerald-400">
                                            {item.kpi_code}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-slate-100">
                                                {item.title}
                                            </div>
                                            {item.description && (
                                                <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                                                    {item.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="space-x-2 px-4 py-4 text-right whitespace-nowrap">
                                            <Link
                                                href={route('my-unit.submit', {
                                                    actionPlanUnit: item.id,
                                                    reporting_period_id:
                                                        reportingPeriod?.id,
                                                })}
                                                className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-500"
                                            >
                                                {item.status === 'submitted'
                                                    ? 'Update Submission'
                                                    : 'Submit Evidence'}
                                            </Link>
                                            <Link
                                                href={route(
                                                    'my-unit.submissions-history',
                                                    { actionPlanUnit: item.id },
                                                )}
                                                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-700"
                                            >
                                                History
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-12 text-center text-slate-500"
                                    >
                                        No action plans assigned to your unit
                                        for this reporting period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
