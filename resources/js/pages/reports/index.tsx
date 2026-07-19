import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Kpi {
    id: number;
    title: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
}

interface SubKra {
    id: number;
    code: string;
    title: string;
    kpis: Kpi[];
}

interface Kra {
    id: number;
    number: string;
    title: string;
    sub_kras: SubKra[];
}

interface Props {
    kras: Kra[];
    summary: Record<string, number>;
}

const STATUS_ORDER = ['Pending', 'Approved', 'Rejected', 'Completed'] as const;

export default function ReportsIndex({ kras, summary }: Props) {
    return (
        <>
            <Head title="Reports" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Reports
                    </h1>
                    <p className="text-muted-foreground">
                        KPI status rollup across all Key Results Areas.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                    {STATUS_ORDER.map((status) => (
                        <Card key={status}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {status}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-2xl font-bold">
                                {summary[status] ?? 0}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    {kras.length === 0 ? (
                        <p className="py-8 text-center text-muted-foreground">
                            No KRAs yet.
                        </p>
                    ) : (
                        kras.map((kra) => (
                            <Card key={kra.id}>
                                <CardHeader>
                                    <CardTitle>
                                        KRA {kra.number} — {kra.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sub KRA</TableHead>
                                                <TableHead>KPIs</TableHead>
                                                <TableHead>Pending</TableHead>
                                                <TableHead>Approved</TableHead>
                                                <TableHead>Rejected</TableHead>
                                                <TableHead>Completed</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {kra.sub_kras.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="py-4 text-center text-muted-foreground"
                                                    >
                                                        No Sub KRAs yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                kra.sub_kras.map((sub) => {
                                                    const counts = STATUS_ORDER.reduce<
                                                        Record<string, number>
                                                    >((acc, s) => {
                                                        acc[s] = sub.kpis.filter(
                                                            (k) => k.status === s,
                                                        ).length;
                                                        return acc;
                                                    }, {});
                                                    return (
                                                        <TableRow key={sub.id}>
                                                            <TableCell className="font-medium">
                                                                {sub.code} —{' '}
                                                                {sub.title}
                                                            </TableCell>
                                                            <TableCell>
                                                                {sub.kpis.length}
                                                            </TableCell>
                                                            <TableCell>
                                                                {counts.Pending}
                                                            </TableCell>
                                                            <TableCell>
                                                                {counts.Approved}
                                                            </TableCell>
                                                            <TableCell>
                                                                {counts.Rejected}
                                                            </TableCell>
                                                            <TableCell>
                                                                {counts.Completed}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
