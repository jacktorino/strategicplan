import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface KPI {
    id: number;
    title: string;
    description: string | null;
    target: string | null;
    unit_of_measure: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
}

interface Kra {
    id: number;
    number: string;
    title: string;
}

interface SubKra {
    id: number;
    code: string;
    title: string;
    description: string | null;
    order_no: number;
    kra: Kra;
    kpis: KPI[];
}

interface Props {
    subKra: SubKra;
}

export default function SubKraShow({ subKra }: Props) {
    return (
        <>
            <Head title={`${subKra.code} - KPIs`} />

            <div className="space-y-6 p-6">
                {/* Breadcrumb */}
                <nav
                    className="flex items-center text-sm text-muted-foreground"
                    aria-label="Breadcrumb"
                >
                    <Link
                        href="/strategic-plans"
                        className="hover:text-foreground"
                    >
                        Strategic Plans
                    </Link>
                    <ChevronRight className="mx-2 h-4 w-4" />
                    <Link
                        href="/strategic-plans"
                        className="hover:text-foreground"
                    >
                        {' '}
                        Key Results Area
                    </Link>

                    <ChevronRight className="mx-2 h-4 w-4" />
                    <span className="font-medium text-foreground">Kpi</span>
                </nav>

                {/* Header */}
                <div>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mb-4 -ml-4"
                    >
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold">
                        {subKra.code} - {subKra.title}
                    </h1>

                    {subKra.description && (
                        <p className="mt-2 text-muted-foreground">
                            {subKra.description}
                        </p>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Key Performance Indicators
                                    </TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {subKra.kpis.length > 0 ? (
                                    subKra.kpis.map((kpi) => (
                                        <TableRow key={kpi.id}>
                                            <TableCell>
                                                <div className="font-medium"></div>

                                                {kpi.description && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {kpi.description}{' '}
                                                        {kpi.title}
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {kpi.target ?? '-'}
                                            </TableCell>

                                            <TableCell>
                                                {kpi.unit_of_measure ?? '-'}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        kpi.status ===
                                                        'Approved'
                                                            ? 'default'
                                                            : kpi.status ===
                                                                'Pending'
                                                              ? 'secondary'
                                                              : kpi.status ===
                                                                  'Rejected'
                                                                ? 'destructive'
                                                                : 'outline'
                                                    }
                                                >
                                                    {kpi.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/kpi/${kpi.id}`}
                                                    >
                                                        View KPI
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No KPIs found for this Sub KRA.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
