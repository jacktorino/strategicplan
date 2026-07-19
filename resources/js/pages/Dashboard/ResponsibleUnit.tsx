import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ListChecks,
    Clock,
    CheckCircle2,
    Trophy,
    SquarePen,
} from 'lucide-react';

interface KpiStatusSlice {
    status: 'approved' | 'pending' | 'rejected' | 'completed';
    count: number;
}

interface MonthlyProgressPoint {
    month: string;
    accomplishment: number;
}

interface MyKpi {
    id: number;
    title: string;
    target: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    latestProgress: number | null;
}

interface ResponsibleUnitProps {
    stats?: {
        myKpis: number;
        pending: number;
        approved: number;
        completed: number;
    };
    kpiStatusBreakdown?: KpiStatusSlice[];
    monthlyProgress?: MonthlyProgressPoint[];
    myKpis?: MyKpi[];
}

const STATUS_COLORS: Record<KpiStatusSlice['status'], string> = {
    approved: '#22c55e',
    pending: '#eab308',
    rejected: '#ef4444',
    completed: '#0ea5e9',
};

const STATUS_LABELS: Record<KpiStatusSlice['status'], string> = {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    completed: 'Completed',
};

const STATUS_BADGE_VARIANT: Record<
    MyKpi['status'],
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Pending: 'secondary',
    Approved: 'default',
    Rejected: 'destructive',
    Completed: 'outline',
};

const AXIS_STYLE = {
    fontSize: 12,
    fill: 'hsl(var(--muted-foreground))',
};

export default function ResponsibleUnit({
    stats = { myKpis: 0, pending: 0, approved: 0, completed: 0 },
    kpiStatusBreakdown = [],
    monthlyProgress = [],
    myKpis = [],
}: ResponsibleUnitProps) {
    const totalKpiStatuses = kpiStatusBreakdown.reduce(
        (sum, s) => sum + s.count,
        0,
    );

    const statCards = [
        { label: 'My KPIs', value: stats.myKpis, icon: ListChecks },
        { label: 'Pending', value: stats.pending, icon: Clock },
        { label: 'Approved', value: stats.approved, icon: CheckCircle2 },
        { label: 'Completed', value: stats.completed, icon: Trophy },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div />
                    <Button asChild size="sm">
                        <Link href="/key-result-area/kpi/create">
                            <SquarePen className="mr-2 h-4 w-4" /> Propose a KPI
                        </Link>
                    </Button>
                </div>

                {/* Stat cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {statCards.map(({ label, value, icon: Icon }) => (
                        <Card
                            key={label}
                            className="border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {value.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-sidebar-border/70 md:col-span-1 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>My KPI Status</CardTitle>
                            <CardDescription>
                                Breakdown across your sub-KRA
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {totalKpiStatuses === 0 ? (
                                <EmptyState label="You haven't proposed any KPIs yet" />
                            ) : (
                                <>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={220}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={kpiStatusBreakdown}
                                                dataKey="count"
                                                nameKey="status"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={2}
                                            >
                                                {kpiStatusBreakdown.map(
                                                    (slice) => (
                                                        <Cell
                                                            key={slice.status}
                                                            fill={
                                                                STATUS_COLORS[
                                                                    slice.status
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(
                                                    value: number,
                                                    _name,
                                                    entry,
                                                ) => [
                                                    value,
                                                    STATUS_LABELS[
                                                        (
                                                            entry.payload as KpiStatusSlice
                                                        ).status
                                                    ],
                                                ]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                                        {kpiStatusBreakdown.map((slice) => (
                                            <div
                                                key={slice.status}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            STATUS_COLORS[
                                                                slice.status
                                                            ],
                                                    }}
                                                />
                                                {STATUS_LABELS[slice.status]} (
                                                {slice.count})
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 md:col-span-2 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>My Accomplishment Trend</CardTitle>
                            <CardDescription>
                                Average monthly accomplishment across your KPIs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlyProgress.length === 0 ? (
                                <EmptyState label="No progress entries recorded yet" />
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={monthlyProgress}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={AXIS_STYLE}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={AXIS_STYLE}
                                            axisLine={false}
                                            tickLine={false}
                                            unit="%"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: 8,
                                                fontSize: 12,
                                            }}
                                            formatter={(value: number) => [
                                                `${value}%`,
                                                'Accomplishment',
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="accomplishment"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* My KPIs table */}
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>My KPIs</CardTitle>
                        <CardDescription>
                            Target and latest recorded progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myKpis.length === 0 ? (
                            <EmptyState label="You haven't proposed any KPIs yet" />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>KPI</TableHead>
                                        <TableHead>Target</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Latest Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myKpis.map((kpi) => (
                                        <TableRow key={kpi.id}>
                                            <TableCell className="max-w-xs truncate">
                                                {kpi.title}
                                            </TableCell>
                                            <TableCell>
                                                {kpi.target ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_BADGE_VARIANT[
                                                            kpi.status
                                                        ]
                                                    }
                                                >
                                                    {kpi.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {kpi.latestProgress !== null
                                                    ? `${kpi.latestProgress}%`
                                                    : '—'}
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

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            {label}
        </div>
    );
}
