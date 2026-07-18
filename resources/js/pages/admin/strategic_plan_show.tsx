import { Head, Link } from '@inertiajs/react';
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
import { ArrowLeft, FileText } from 'lucide-react';

interface Kra {
    id: number;
    number: string;
    title: string;
    description: string | null;
    order_no: number;
}

interface StrategicPlan {
    id: number;
    title: string;
    school_year: string;
    description?: string;
    status: 'Draft' | 'Active' | 'Archived';
    creator?: { name: string };
    kras: Kra[];
}

interface Props {
    plan: StrategicPlan;
}

export default function StrategicPlanShow({ plan }: Props) {
    return (
        <>
            <Head title={plan.title} />

            <div className="space-y-6 p-6">
                <div>
                    <Link href="/strategic-plans">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Strategic Plans
                        </Button>
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {plan.title}
                            </h1>
                            <p className="text-muted-foreground">
                                {plan.school_year} · Created by{' '}
                                {plan.creator?.name ?? 'Unknown'}
                            </p>
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

                    {plan.description && (
                        <p className="mt-4 max-w-3xl text-muted-foreground">
                            {plan.description}
                        </p>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Key Result Areas ({plan.kras.length})
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {plan.kras.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    No KRAs Yet
                                </h3>
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    This strategic plan doesn't have any Key
                                    Result Areas defined yet.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-24">
                                            Number
                                        </TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-24 text-center">
                                            Order
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {plan.kras.map((kra) => (
                                        <TableRow key={kra.id}>
                                            <TableCell className="font-medium">
                                                KRA {kra.number}
                                            </TableCell>
                                            <TableCell>{kra.title}</TableCell>
                                            <TableCell>
                                                {kra.description ?? '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {kra.order_no}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
