import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface KPI {
    id: number;
    title: string;
    description: string | null;
    target: string | null;
    unit_of_measure: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    remarks: string | null;
    created_at: string;
}

interface Props {
    kpi: KPI;
}

export default function KpiShow({ kpi }: Props) {
    const getStatusColor = (status: KPI['status']) => {
        switch (status) {
            case 'Approved':
                return 'default';
            case 'Completed':
                return 'secondary';
            case 'Rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <Head title={`KPI - ${kpi.title}`} />

            <div className="space-y-6 p-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <div className="mx-auto max-w-4xl space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">
                                    {kpi.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Created on{' '}
                                    {new Date(
                                        kpi.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <Badge
                                variant={getStatusColor(kpi.status)}
                                className="px-3 py-1 text-sm"
                            >
                                {kpi.status}
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Description
                                </h3>
                                <p className="rounded-md bg-slate-50 p-4 text-muted-foreground">
                                    {kpi.description ||
                                        'No description provided.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-lg border p-4">
                                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                                        Target
                                    </h4>
                                    <p className="text-lg font-medium">
                                        {kpi.target || 'Not set'}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                                        Unit of Measure
                                    </h4>
                                    <p className="text-lg font-medium">
                                        {kpi.unit_of_measure || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {kpi.remarks && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Remarks
                                        </h3>
                                        <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground italic">
                                            {kpi.remarks}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
