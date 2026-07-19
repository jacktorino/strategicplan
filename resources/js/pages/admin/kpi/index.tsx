import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from 'lucide-react';

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

interface SubKraOption {
    id: number;
    code: string;
    title: string;
    kra_id: number;
    kra: { id: number; number: string };
}

interface KpiRow {
    id: number;
    title: string;
    description: string;
    target: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    sub_kra_id: number;
    sub_kra: SubKraOption;
    action_plans_count: number;
    progress_count: number;
}

interface Props {
    kpis: KpiRow[];
    subKras: SubKraOption[];
    filters: { sub_kra_id?: string };
}

const STATUS_VARIANT: Record<
    KpiRow['status'],
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Pending: 'secondary',
    Approved: 'default',
    Rejected: 'destructive',
    Completed: 'outline',
};

KpiIndex.layout = {
    breadcrumbs: [
        {
            title: 'KRA',
            href: '/subkra',
        },
        {
            title: 'KPI',
            href: '/',
        },
    ],
};

export default function KpiIndex({ kpis, subKras, filters }: Props) {
    const selectedSubKraId = filters.sub_kra_id ?? 'all';

    function handleFilterChange(value: string) {
        router.get('/kpi', value === 'all' ? {} : { sub_kra_id: value }, {
            preserveState: true,
            replace: true,
        });
    }
    function handleDelete(kpi: KpiRow) {
        if (
            !confirm(
                `Delete KPI "${kpi.title}"? This also removes its action plans and progress history.`,
            )
        ) {
            return;
        }

        router.delete(`/kpi/${kpi.id}`);
    }
    return (
        <>
            <Head title="KPIs" />

            <div className="space-y-6 p-6">
                <div>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-4"
                    >
                        <Link href="/subkra">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sub KRAs
                        </Link>
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Key Performance Indicators
                            </h1>
                        </div>

                        <Button asChild>
                            <Link
                                href={
                                    selectedSubKraId !== 'all'
                                        ? `/kpi/create?sub_kra_id=${selectedSubKraId}`
                                        : '/kpi/create'
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add KPI
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Filter by Sub KRA:
                    </span>
                    <Select
                        value={selectedSubKraId}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="w-72">
                            <SelectValue placeholder="All Sub KRAs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sub KRAs</SelectItem>
                            {subKras.map((sub) => (
                                <SelectItem key={sub.id} value={String(sub.id)}>
                                    {sub.code} — {sub.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead className="text-center">
                                    Status
                                </TableHead>
                                <TableHead>Plans / Progress</TableHead>
                                <TableHead className="w-40 text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kpis.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No KPIs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kpis.map((kpi) => (
                                    <TableRow key={kpi.id}>
                                        <TableCell className="font-medium">
                                            <span className="text-sm text-muted-foreground">
                                                {kpi.description}{' '}
                                            </span>{' '}
                                        </TableCell>
                                        <TableCell> {kpi.title}</TableCell>

                                        <TableCell className="text-sm">
                                            {kpi.target ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={
                                                    STATUS_VARIANT[kpi.status]
                                                }
                                            >
                                                {kpi.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {kpi.action_plans_count} plan
                                            {kpi.action_plans_count === 1
                                                ? ''
                                                : 's'}{' '}
                                            · {kpi.progress_count} entr
                                            {kpi.progress_count === 1
                                                ? 'y'
                                                : 'ies'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link href={`/kpi/${kpi.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={`/kpi/${kpi.id}/edit`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(kpi)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
