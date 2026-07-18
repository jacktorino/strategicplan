import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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

import ActionPlanDialog from './action-plan-dialog';
import ProgressDialog from './progress-dialog';

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

interface ActionPlan {
    id: number;
    kpi_id: number;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    expected_output: string | null;
}

interface ProgressEntry {
    id: number;
    kpi_id: number;
    percentage: number;
    month: number;
    year: number;
    remarks: string | null;
}

interface Kpi {
    id: number;
    title: string;
    description: string | null;
    target: string | null;
    unit_of_measure: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    remarks: string | null;
    sub_kra: {
        id: number;
        code: string;
        title: string;
        kra: { id: number; number: string; title: string };
    };
    responsible_units: { id: number; name: string; acronym: string | null }[];
    action_plans: ActionPlan[];
    progress: ProgressEntry[];
}

interface Props {
    kpi: Kpi;
}

export default function KpiShow({ kpi }: Props) {
    const [planDialogOpen, setPlanDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);

    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(
        null,
    );

    function openNewPlan() {
        setEditingPlan(null);
        setPlanDialogOpen(true);
    }

    function openEditPlan(plan: ActionPlan) {
        setEditingPlan(plan);
        setPlanDialogOpen(true);
    }

    function deletePlan(plan: ActionPlan) {
        if (!confirm(`Delete action plan "${plan.title}"?`)) return;
        router.delete(`/action-plans/${plan.id}`, {
            preserveScroll: true,
        });
    }

    function openNewEntry() {
        setEditingEntry(null);
        setProgressDialogOpen(true);
    }

    function openEditEntry(entry: ProgressEntry) {
        setEditingEntry(entry);
        setProgressDialogOpen(true);
    }

    function deleteEntry(entry: ProgressEntry) {
        if (
            !confirm(
                `Delete the ${MONTH_LABELS[entry.month - 1]} ${entry.year} progress entry?`,
            )
        )
            return;
       router.delete(`/progress/${entry.id}`, {
    preserveScroll: true,
});
    }

    const chartData = [...kpi.progress]
        .sort((a, b) => a.year - b.year || a.month - b.month)
        .map((p) => ({
            label: MONTH_LABELS[p.month - 1] ?? `M${p.month}`,
            percentage: p.percentage,
        }));

    return (
        <>
            <Head title={kpi.title} />

            <div className="space-y-6 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="mb-3 -ml-4"
                        >
                            <Link href={`/kpi?sub_kra_id=${kpi.sub_kra.id}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to KPIs
                            </Link>
                        </Button>

                        <p className="text-sm text-muted-foreground">
                            KRA {kpi.sub_kra.kra.number} · {kpi.sub_kra.code} —{' '}
                            {kpi.sub_kra.title}
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {kpi.title}
                        </h1>
                        {kpi.description && (
                            <p className="mt-1 max-w-2xl text-muted-foreground">
                                {kpi.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge>{kpi.status}</Badge>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/kpi/${kpi.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit KPI
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Target
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {kpi.target ?? '—'}{' '}
                            {kpi.unit_of_measure && (
                                <span className="text-sm text-muted-foreground">
                                    ({kpi.unit_of_measure})
                                </span>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Responsible Units
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {kpi.responsible_units.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {kpi.responsible_units.map((unit) => (
                                        <Badge
                                            key={unit.id}
                                            variant="secondary"
                                        >
                                            {unit.acronym ?? unit.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground italic">
                                    None assigned
                                </span>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Remarks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            {kpi.remarks ?? (
                                <span className="text-muted-foreground italic">
                                    None
                                </span>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Plans */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Innovative Action Plans</CardTitle>
                        <Button size="sm" onClick={openNewPlan}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Plan
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {kpi.action_plans.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                No action plans yet.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Timeline</TableHead>
                                        <TableHead>Expected output</TableHead>
                                        <TableHead className="w-24 text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kpi.action_plans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">
                                                {plan.title}
                                                {plan.description && (
                                                    <div className="text-sm font-normal text-muted-foreground">
                                                        {plan.description}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {plan.start_date ?? '—'}
                                                {' → '}
                                                {plan.end_date ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {plan.expected_output ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditPlan(plan)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        deletePlan(plan)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Progress */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Monthly Progress</CardTitle>
                        <Button size="sm" onClick={openNewEntry}>
                            <Plus className="mr-2 h-4 w-4" />
                            Record Progress
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {chartData.length > 0 && (
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{
                                            top: 8,
                                            right: 8,
                                            left: -20,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="label"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `${v}%`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [
                                                `${value}%`,
                                                'Progress',
                                            ]}
                                        />
                                        <Bar
                                            dataKey="percentage"
                                            radius={[4, 4, 0, 0]}
                                            fill="var(--primary)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {kpi.progress.length === 0 ? (
                            <p className="py-2 text-center text-sm text-muted-foreground">
                                No progress recorded yet.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead className="w-24 text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...kpi.progress]
                                        .sort(
                                            (a, b) =>
                                                b.year - a.year ||
                                                b.month - a.month,
                                        )
                                        .map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell>
                                                    {
                                                        MONTH_LABELS[
                                                            entry.month - 1
                                                        ]
                                                    }{' '}
                                                    {entry.year}
                                                </TableCell>
                                                <TableCell>
                                                    {entry.percentage}%
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {entry.remarks ?? '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEditEntry(entry)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            deleteEntry(entry)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ActionPlanDialog
                kpiId={kpi.id}
                open={planDialogOpen}
                onOpenChange={setPlanDialogOpen}
                actionPlan={editingPlan}
            />

            <ProgressDialog
                kpiId={kpi.id}
                open={progressDialogOpen}
                onOpenChange={setProgressDialogOpen}
                entry={editingEntry}
            />
        </>
    );
}
