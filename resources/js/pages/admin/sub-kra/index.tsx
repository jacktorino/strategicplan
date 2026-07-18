import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';

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

interface KraOption {
    id: number;
    number: string;
    title: string;
}

interface SubKraRow {
    id: number;
    code: string;
    title: string;
    order_no: number;
    kra_id: number;
    kra: KraOption;
    kpis_count: number;
}

interface Props {
    subKras: SubKraRow[];
    kras: KraOption[];
    filters: { kra_id?: string };
}

export default function SubKraIndex({ subKras, kras, filters }: Props) {
    const selectedKraId = filters.kra_id ?? 'all';

    function handleFilterChange(value: string) {
        router.get('/subkra', value === 'all' ? {} : { kra_id: value }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleDelete(subKra: SubKraRow) {
        if (
            !confirm(
                subKra.kpis_count > 0
                    ? `"${subKra.title}" has ${subKra.kpis_count} KPI(s) attached, which will be deleted too. Continue?`
                    : `Delete Sub KRA "${subKra.title}"?`,
            )
        ) {
            return;
        }

        router.delete(`/subkra/${subKra.id}`);
    }

    return (
        <>
            <Head title="Sub KRAs" />

            <div className="space-y-6 p-6">
                <div>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-4"
                    >
                        <Link href="/kra">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to KRAs
                        </Link>
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Sub KRAs
                            </h1>
                            <p className="text-muted-foreground">
                                Sub-areas within each KRA.
                            </p>
                        </div>

                        <Button asChild>
                            <Link
                                href={
                                    selectedKraId !== 'all'
                                        ? `/subkra/create?kra_id=${selectedKraId}`
                                        : '/subkra/create'
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Sub KRA
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Filter by KRA:
                    </span>
                    <Select
                        value={selectedKraId}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="All KRAs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All KRAs</SelectItem>
                            {kras.map((kra) => (
                                <SelectItem key={kra.id} value={String(kra.id)}>
                                    KRA {kra.number} — {kra.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-28">Code</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>KRA</TableHead>
                                <TableHead>KPIs</TableHead>
                                <TableHead className="w-32 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subKras.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No Sub KRAs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subKras.map((subKra) => (
                                    <TableRow key={subKra.id}>
                                        <TableCell className="font-medium">
                                            {subKra.code}
                                        </TableCell>
                                        <TableCell>{subKra.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            KRA {subKra.kra.number}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/kpi?sub_kra_id=${subKra.id}`}
                                            >
                                                <Badge variant="outline">
                                                    {subKra.kpis_count} KPI
                                                    {subKra.kpis_count === 1
                                                        ? ''
                                                        : 's'}
                                                </Badge>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={`/subkra/${subKra.id}/edit`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(subKra)
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
