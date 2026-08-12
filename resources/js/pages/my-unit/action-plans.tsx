import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

// --- Interfaces ---
interface ReportingPeriod {
    id: number;
    period_start: string;
    period_end: string;
}

interface ActionPlanUnitItem {
    id: number; // action_plan_unit_id
    action_plan_id: number;
    kra_code: string;
    kra_name: string;
    sub_kra_code: string;
    sub_kra_name: string;
    kpi_code: string;
    kpi_name: string;
    title: string;
    description: string | null;
    status:
        | 'pending'
        | 'submitted'
        | 'late'
        | 'under_review'
        | 'accepted'
        | 'returned';
    submitted_at?: string;
    submission_id?: number;
}

interface PageProps {
    unit?: { id: number; code: string; name: string } | null;
    reportingPeriod?: ReportingPeriod | null;
    actionPlans?: ActionPlanUnitItem[];
}

interface KpiGroup {
    kpiKey: string;
    kpiCode: string;
    kpiName: string;
    items: ActionPlanUnitItem[];
}

interface SubKraGroup {
    subKraKey: string;
    subKraCode: string;
    subKraName: string;
    totalRows: number;
    kpis: KpiGroup[];
}

// --- Helper Functions ---
const sanitizeKpiCode = (
    code: string | null | undefined,
    subKraCode?: string,
): string => {
    if (!code) return '';
    let cleaned = code;

    // Strip explicit text labels like "Sub-KRA 1.1 - ", "SUBKRA:", "SKRA - ", or "KRA - "
    cleaned = cleaned.replace(
        /^(Sub[-_\s]*KRA|SUBKRA|SKRA|KRA)\s*[-_:]*\s*\d*(\.\d+)*\s*[-_:]*\s*/i,
        '',
    );

    // Strip sub_kra_code if prepended to the kpi_code string
    if (subKraCode && subKraCode.trim()) {
        const escapedSubKraCode = subKraCode
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const subKraRegex = new RegExp(
            `^${escapedSubKraCode}\\s*[-_.:]*\\s*`,
            'i',
        );
        cleaned = cleaned.replace(subKraRegex, '');
    }

    return cleaned.trim();
};

const groupItemsBySubKraAndKpi = (
    items: ActionPlanUnitItem[],
): SubKraGroup[] => {
    const subKraMap = new Map<
        string,
        {
            subKraCode: string;
            subKraName: string;
            kpiMap: Map<
                string,
                {
                    kpiCode: string;
                    kpiName: string;
                    items: ActionPlanUnitItem[];
                }
            >;
        }
    >();

    for (const item of items) {
        const subKraKey = `${item.sub_kra_code || ''}___${item.sub_kra_name || ''}`;
        const cleanKpiCode = sanitizeKpiCode(item.kpi_code, item.sub_kra_code);
        const kpiKey = `${cleanKpiCode}___${item.kpi_name}`;

        if (!subKraMap.has(subKraKey)) {
            subKraMap.set(subKraKey, {
                subKraCode: item.sub_kra_code,
                subKraName: item.sub_kra_name,
                kpiMap: new Map(),
            });
        }

        const subKraEntry = subKraMap.get(subKraKey)!;
        if (!subKraEntry.kpiMap.has(kpiKey)) {
            subKraEntry.kpiMap.set(kpiKey, {
                kpiCode: cleanKpiCode,
                kpiName: item.kpi_name,
                items: [],
            });
        }

        subKraEntry.kpiMap.get(kpiKey)!.items.push(item);
    }

    const result: SubKraGroup[] = [];

    subKraMap.forEach((subKraVal, subKraKey) => {
        const kpis: KpiGroup[] = [];
        let totalRows = 0;

        subKraVal.kpiMap.forEach((kpiVal, kpiKey) => {
            kpis.push({
                kpiKey,
                kpiCode: kpiVal.kpiCode,
                kpiName: kpiVal.kpiName,
                items: kpiVal.items,
            });
            totalRows += kpiVal.items.length;
        });

        result.push({
            subKraKey,
            subKraCode: subKraVal.subKraCode,
            subKraName: subKraVal.subKraName,
            totalRows,
            kpis,
        });
    });

    return result;
};

// --- Sub-Components ---
const StatusBadge = ({ status }: { status: ActionPlanUnitItem['status'] }) => {
    switch (status) {
        case 'submitted':
        case 'accepted':
            return (
                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {status === 'accepted' ? 'Accepted' : 'Submitted'}
                </span>
            );
        case 'under_review':
            return (
                <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    Under Review
                </span>
            );
        case 'late':
        case 'returned':
            return (
                <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                    {status === 'returned' ? 'Returned' : 'Late Submission'}
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Pending
                </span>
            );
    }
};

// --- Main Component ---
export default function UnitActionPlans({
    unit,
    reportingPeriod,
    actionPlans = [],
}: PageProps) {
    // Memoize the nested grouping calculations to prevent overhead on re-renders
    const groupedKraData = useMemo(() => {
        if (!actionPlans || actionPlans.length === 0) return [];

        const groupedByKra = actionPlans.reduce(
            (acc, item) => {
                const kraTitle = item.kra_code
                    ? `${item.kra_code} - ${item.kra_name}`
                    : item.kra_name || 'General';
                if (!acc[kraTitle]) {
                    acc[kraTitle] = [];
                }
                acc[kraTitle].push(item);
                return acc;
            },
            {} as Record<string, ActionPlanUnitItem[]>,
        );

        return Object.entries(groupedByKra).map(([kraHeader, items]) => ({
            kraHeader,
            subKraGroups: groupItemsBySubKraAndKpi(items),
        }));
    }, [actionPlans]);

    return (
        <div className="min-h-screen space-y-6 bg-background p-6 text-foreground">
            <Head title={`Unit Action Plans - ${unit?.name ?? 'My Unit'}`} />

            {/* Main Header */}
            <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        {unit?.code ? `${unit.code} - ` : ''}
                        {unit?.name ?? 'Unit Dashboard'}
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Assigned Action Plans
                    </h1>
                </div>

                {/* Active Period Badge */}
                {reportingPeriod ? (
                    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">
                            Active Period:
                        </span>
                        <span className="font-semibold">
                            {reportingPeriod.period_start} to{' '}
                            {reportingPeriod.period_end}
                        </span>
                    </div>
                ) : (
                    <div className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        No active period set
                    </div>
                )}
            </div>

            {/* Action Plans Grouped by KRA */}
            {groupedKraData.length > 0 ? (
                <div className="space-y-8">
                    {groupedKraData.map(({ kraHeader, subKraGroups }) => (
                        <div key={kraHeader} className="space-y-3">
                            {/* KRA Header */}
                            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-4 py-2.5">
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    KRA:
                                </span>
                                <h2 className="text-sm font-bold text-foreground">
                                    {kraHeader}
                                </h2>
                            </div>

                            {/* Action Plans Table */}
                            <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left text-sm">
                                        <thead className="border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase">
                                            <tr>
                                                <th className="w-1/5 px-4 py-3">
                                                    Sub-KRA
                                                </th>
                                                <th className="w-1/4 px-4 py-3">
                                                    KPI
                                                </th>
                                                <th className="px-4 py-3">
                                                    Action Plan Title
                                                </th>
                                                <th className="px-4 py-3">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-right">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {subKraGroups.flatMap(
                                                (subKraGroup) =>
                                                    subKraGroup.kpis.flatMap(
                                                        (kpiGroup, kpiIdx) =>
                                                            kpiGroup.items.map(
                                                                (
                                                                    item,
                                                                    itemIdx,
                                                                ) => {
                                                                    const isFirstRowOfSubKra =
                                                                        kpiIdx ===
                                                                            0 &&
                                                                        itemIdx ===
                                                                            0;
                                                                    const isFirstRowOfKpi =
                                                                        itemIdx ===
                                                                        0;

                                                                    const submitUrl = `/my-unit/submit/${item.id}${
                                                                        reportingPeriod?.id
                                                                            ? `?reporting_period_id=${reportingPeriod.id}`
                                                                            : ''
                                                                    }`;

                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="transition-colors hover:bg-muted/40"
                                                                        >
                                                                            {/* Column 1: Sub-KRA */}
                                                                            {isFirstRowOfSubKra && (
                                                                                <td
                                                                                    rowSpan={
                                                                                        subKraGroup.totalRows
                                                                                    }
                                                                                    className="border-r border-border/40 bg-card px-4 py-4 align-top"
                                                                                >
                                                                                    <div className="font-medium text-foreground">
                                                                                        {subKraGroup.subKraCode
                                                                                            ? `${subKraGroup.subKraCode} - `
                                                                                            : ''}
                                                                                        {
                                                                                            subKraGroup.subKraName
                                                                                        }
                                                                                    </div>
                                                                                </td>
                                                                            )}

                                                                            {/* Column 2: KPI */}
                                                                            {isFirstRowOfKpi && (
                                                                                <td
                                                                                    rowSpan={
                                                                                        kpiGroup
                                                                                            .items
                                                                                            .length
                                                                                    }
                                                                                    className="border-r border-border/40 bg-card px-4 py-4 align-top"
                                                                                >
                                                                                    <div className="font-medium text-foreground">
                                                                                        {kpiGroup.kpiCode
                                                                                            ? `${kpiGroup.kpiCode} - ${kpiGroup.kpiName}`
                                                                                            : kpiGroup.kpiName}
                                                                                    </div>
                                                                                </td>
                                                                            )}

                                                                            {/* Column 3: Action Plan Title & Description */}
                                                                            <td className="px-4 py-4 align-top">
                                                                                <div className="font-medium text-foreground">
                                                                                    {
                                                                                        item.title
                                                                                    }
                                                                                </div>
                                                                                {item.description && (
                                                                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                                                        {
                                                                                            item.description
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </td>

                                                                            {/* Column 4: Status */}
                                                                            <td className="px-4 py-4 align-top whitespace-nowrap">
                                                                                <StatusBadge
                                                                                    status={
                                                                                        item.status
                                                                                    }
                                                                                />
                                                                            </td>

                                                                            {/* Column 5: Actions */}
                                                                            <td className="space-x-2 px-4 py-4 text-right align-top whitespace-nowrap">
                                                                                <Link
                                                                                    href={
                                                                                        submitUrl
                                                                                    }
                                                                                    className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                                                                >
                                                                                    {item.status ===
                                                                                        'submitted' ||
                                                                                    item.status ===
                                                                                        'accepted'
                                                                                        ? 'Update Submission'
                                                                                        : 'Comply'}
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                },
                                                            ),
                                                    ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-md border border-border bg-card py-12 text-center text-sm text-muted-foreground shadow-sm">
                    No action plans assigned to your unit for this reporting
                    period.
                </div>
            )}
        </div>
    );
}
