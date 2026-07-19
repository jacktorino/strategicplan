import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import ProgressDialog from '../../admin/kpi/progress-dialog';

const MONTH_LABELS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

interface ProgressEntry {
    id: number;
    kpi_id: number;
    percentage: number;
    month: number;
    year: number;
    remarks: string | null;
}

interface KpiRow {
    id: number;
    title: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    progress: ProgressEntry[];
}

interface Props {
    kpis: KpiRow[];
}

function latestEntry(entries: ProgressEntry[]): ProgressEntry | null {
    return (
        [...entries].sort((a, b) => b.year - a.year || b.month - a.month)[0] ??
        null
    );
}

export default function KeyResultAreaProgressIndex({ kpis }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeKpiId, setActiveKpiId] = useState<number | null>(null);

    function openFor(kpiId: number) {
        setActiveKpiId(kpiId);
        setDialogOpen(true);
    }

    return (
        <>
            <Head title="Progress" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Progress
                    </h1>
                    <p className="text-muted-foreground">
                        Latest monthly compliance across your KPIs.
                    </p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>KPI</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Latest entry</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead className="w-32 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kpis.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No KPIs yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kpis.map((kpi) => {
                                    const latest = latestEntry(kpi.progress);
                                    return (
                                        <TableRow key={kpi.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/key-result-area/kpi/${kpi.id}`}
                                                    className="hover:underline"
                                                >
                                                    {kpi.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {kpi.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {latest
                                                    ? `${MONTH_LABELS[latest.month - 1]} ${latest.year}`
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="w-40">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-primary"
                                                            style={{
                                                                width: `${latest?.percentage ?? 0}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {latest?.percentage ??
                                                            0}
                                                        %
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openFor(kpi.id)
                                                    }
                                                >
                                                    Record
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {activeKpiId !== null && (
                <ProgressDialog
                    kpiId={activeKpiId}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                />
            )}
        </>
    );
}
