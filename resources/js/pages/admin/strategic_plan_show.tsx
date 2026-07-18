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
}
interface SubKra {
    id: number;
    code: string;
    title: string;
    description: string | null;
    order_no: number;
    kpis: KPI[]; // Add this line
}

interface Kra {
    id: number;
    number: string;
    title: string;
    description: string | null;
    order_no: number;
    sub_kras: SubKra[];
}

interface StrategicPlan {
    id: number;
    title: string;
    school_year: string;
    description?: string;
    status: 'Draft' | 'Active' | 'Archived';
    creator?: {
        name: string;
    };
}

interface Props {
    plan: StrategicPlan;
    kras: Kra[];
}

export default function StrategicPlanShow({ plan, kras }: Props) {
    return (
        <>
            <Head title={`Strategic Plan - ${plan.title}`} />

            <div className="space-y-6 p-6">
                {/* Breadcrumbs */}
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
                    <span className="font-medium text-foreground">
                        Key Results Area
                    </span>
                </nav>

                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="mb-3 -ml-4"
                        >
                            <Link href="/strategic-plans">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>

                        <h1 className="text-3xl font-bold tracking-tight">
                            {plan.title}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Academic Year {plan.school_year}
                        </p>

                        {plan.description && (
                            <p className="mt-4 max-w-3xl text-muted-foreground">
                                {plan.description}
                            </p>
                        )}
                    </div>

                    <Badge
                        variant={
                            plan.status === 'Active'
                                ? 'default'
                                : plan.status === 'Draft'
                                  ? 'secondary'
                                  : 'outline'
                        }
                    >
                        {plan.status}
                    </Badge>
                </div>

                {/* KRA List */}
                <div className="space-y-4">
                    {kras.map((kra) => (
                        <Card key={kra.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    <span className="font-bold">
                                        KRA {kra.number}
                                    </span>{' '}
                                    - {kra.title}
                                    {kra.description && (
                                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                                            ({kra.description})
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Key Results Area
                                            </TableHead>
                                            <TableHead className="w-[180px] text-center">
                                                KPIs
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {kra.sub_kras.length > 0 ? (
                                            kra.sub_kras.map((sub) => (
                                                <TableRow key={sub.id}>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            {sub.code}{' '}
                                                            <span className="text-sm">
                                                                {sub.title}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        <div className="flex flex-col gap-2">
                                                            {sub.kpis.length >
                                                            0 ? (
                                                                <Button
                                                                    asChild
                                                                    variant="default"
                                                                    size="sm"
                                                                >
                                                                    <Link
                                                                        href={`/subkra/${sub.id}`}
                                                                    >
                                                                        View
                                                                        KPIs (
                                                                        {
                                                                            sub
                                                                                .kpis
                                                                                .length
                                                                        }
                                                                        )
                                                                    </Link>
                                                                </Button>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground italic">
                                                                    No KPIs
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={2}
                                                    className="py-8 text-center text-muted-foreground"
                                                >
                                                    No Sub KRAs found for this
                                                    area.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
