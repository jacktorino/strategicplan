import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, Pencil, Settings } from 'lucide-react';
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

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

interface KpiProgressPoint {
    month: number; // 1-12
    year: number;
    percentage: number;
}

interface InnovativeActionPlan {
    id: number;
    kpi_id: number;
    title: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    expected_output?: string | null;
}

interface KPI {
    id: number;
    title: string;
    description?: string | null;
    responsible_units?: string[];
    action_plans?: InnovativeActionPlan[];
    progress?: KpiProgressPoint[];
}

interface SubKra {
    id: number;
    code: string;
    title: string;
    description: string | null;
    order_no: number;
    kpis: KPI[];
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

function KpiProgressChart({ progress }: { progress: KpiProgressPoint[] }) {
    if (!progress || progress.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                No progress data recorded yet.
            </p>
        );
    }

    const chartData = [...progress]
        .sort((a, b) => a.year - b.year || a.month - b.month)
        .map((p) => ({
            label: MONTH_LABELS[p.month - 1] ?? `M${p.month}`,
            percentage: p.percentage,
        }));

    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                        formatter={(value: number) => [`${value}%`, 'Progress']}
                        labelClassName="text-foreground"
                    />
                    <Bar
                        dataKey="percentage"
                        radius={[4, 4, 0, 0]}
                        fill="var(--primary)"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function KpiDetail({ kpi }: { kpi: KPI }) {
    return (
        <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium">
                    {kpi.description && (
                        <span className="mr-1.5 text-muted-foreground">
                            {kpi.description}
                        </span>
                    )}
                    {kpi.title}
                </h4>

                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                >
                    <Link href={`/kpi/${kpi.id}`} title="Manage KPI">
                        <Pencil className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Responsible Units
                    </p>
                    {kpi.responsible_units &&
                    kpi.responsible_units.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {kpi.responsible_units.map((unit) => (
                                <Badge key={unit} variant="secondary">
                                    {unit}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            None assigned
                        </p>
                    )}
                </div>

                <div>
                    <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Innovative Action Plans
                    </p>
                    {kpi.action_plans && kpi.action_plans.length > 0 ? (
                        <ul className="list-inside list-disc space-y-0.5 text-sm">
                            {kpi.action_plans.map((plan) => (
                                <li key={plan.id}>{plan.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            None listed
                        </p>
                    )}
                </div>
            </div>

            <div>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Monthly Progress
                </p>
                <KpiProgressChart progress={kpi.progress ?? []} />
            </div>
        </div>
    );
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

                    <div className="flex items-center gap-2">
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

                        <Button asChild variant="outline" size="sm">
                            <Link href="/kra">
                                <Settings className="mr-2 h-4 w-4" />
                                Manage KRAs
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* KRA List */}
                <div className="space-y-4">
                    {kras.map((kra) => (
                        <Card key={kra.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
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

                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                    >
                                        <Link
                                            href={`/kra/${kra.id}/edit`}
                                            title="Edit KRA"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {kra.sub_kras.length > 0 ? (
                                    <Accordion
                                        type="multiple"
                                        className="w-full"
                                    >
                                        {kra.sub_kras.map((sub) => (
                                            <AccordionItem
                                                key={sub.id}
                                                value={`sub-${sub.id}`}
                                            >
                                                <div className="flex items-center">
                                                    <AccordionTrigger className="hover:no-underline">
                                                        <div className="flex flex-1 items-center justify-between pr-4">
                                                            <div className="text-left">
                                                                <span className="font-medium">
                                                                    {
                                                                        sub.code
                                                                    }{' '}
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {sub.title}
                                                                </span>
                                                            </div>

                                                            <Badge
                                                                variant="outline"
                                                                className="ml-2 shrink-0"
                                                            >
                                                                {
                                                                    sub.kpis
                                                                        .length
                                                                }{' '}
                                                                KPI
                                                                {sub.kpis
                                                                    .length ===
                                                                1
                                                                    ? ''
                                                                    : 's'}
                                                            </Badge>
                                                        </div>
                                                    </AccordionTrigger>

                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 shrink-0"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <Link
                                                            href={`/subkra/${sub.id}/edit`}
                                                            title="Edit Sub KRA"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                </div>

                                                <AccordionContent>
                                                    {sub.kpis.length > 0 ? (
                                                        <div className="space-y-3 pt-1">
                                                            {sub.kpis.map(
                                                                (kpi) => (
                                                                    <KpiDetail
                                                                        key={
                                                                            kpi.id
                                                                        }
                                                                        kpi={
                                                                            kpi
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 py-4">
                                                            <p className="text-center text-sm text-muted-foreground">
                                                                No KPIs found
                                                                for this Sub
                                                                KRA.
                                                            </p>
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={`/kpi/create?sub_kra_id=${sub.id}`}
                                                                >
                                                                    Add KPI
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-8">
                                        <p className="text-center text-muted-foreground">
                                            No Sub KRAs found for this area.
                                        </p>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={`/subkra/create?kra_id=${kra.id}`}
                                            >
                                                Add Sub KRA
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
