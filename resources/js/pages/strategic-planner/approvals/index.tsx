import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface KpiRow {
    id: number;
    title: string;
    target: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    sub_kra: { code: string; title: string; kra: { number: string } };
    responsible_units: { id: number; name: string; acronym: string | null }[];
}

interface Props {
    kpis: KpiRow[];
    filters: { status: string };
}

const STATUS_FILTERS = ['Pending', 'Approved', 'Rejected', 'Completed', 'all'] as const;

export default function ApprovalsIndex({ kpis, filters }: Props) {
    function handleFilter(status: string) {
        router.get(
            route('approvals.index'),
            { status },
            { preserveState: true },
        );
    }

    function approve(kpi: KpiRow) {
        router.patch(route('approvals.approve', kpi.id), {}, { preserveScroll: true });
    }

    function reject(kpi: KpiRow) {
        if (!confirm(`Reject "${kpi.title}"?`)) return;
        router.patch(route('approvals.reject', kpi.id), {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title="KPI Approvals" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            KPI Approvals
                        </h1>
                        <p className="text-muted-foreground">
                            Review KPIs proposed by units across the
                            university.
                        </p>
                    </div>

                    <Select value={filters.status} onValueChange={handleFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FILTERS.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s === 'all' ? 'All statuses' : s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>KPI</TableHead>
                                <TableHead>Sub KRA</TableHead>
                                <TableHead>Responsible units</TableHead>
                                <TableHead>Status</TableHead>
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
                                        Nothing here.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kpis.map((kpi) => (
                                    <TableRow key={kpi.id}>
                                        <TableCell className="font-medium">
                                            {kpi.title}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            KRA {kpi.sub_kra.kra.number} ·{' '}
                                            {kpi.sub_kra.code}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {kpi.responsible_units
                                                .map(
                                                    (u) => u.acronym ?? u.name,
                                                )
                                                .join(', ') || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge>{kpi.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {kpi.status === 'Pending' ? (
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            approve(kpi)
                                                        }
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            reject(kpi)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
