import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ClipboardCheck,
    CheckCircle2,
    XCircle,
    ListChecks,
} from 'lucide-react';

interface KpiStatusSlice {
    status: 'approved' | 'pending' | 'rejected' | 'completed';
    count: number;
}

interface MonthlySubmission {
    month: string;
    Pending: number;
    Approved: number;
    Rejected: number;
    Completed: number;
}

interface PendingApproval {
    id: number;
    title: string;
    subKra: string;
    proposedBy: string;
    submittedAt: string;
}

interface PlanningOfficerProps {
    stats?: {
        pending: number;
        approved: number;
        rejected: number;
        total: number;
    };
    kpiStatusBreakdown?: KpiStatusSlice[];
    monthlySubmissions?: MonthlySubmission[];
    pendingApprovals?: PendingApproval[];
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

const AXIS_STYLE = {
    fontSize: 12,
    fill: 'hsl(var(--muted-foreground))',
};

const STACK_COLORS = {
    Pending: '#eab308',
    Approved: '#22c55e',
    Rejected: '#ef4444',
    Completed: '#0ea5e9',
};

export default function PlanningOfficer({
    stats = { pending: 0, approved: 0, rejected: 0, total: 0 },
    kpiStatusBreakdown = [],
    monthlySubmissions = [],
    pendingApprovals = [],
}: PlanningOfficerProps) {
    const totalKpiStatuses = kpiStatusBreakdown.reduce(
        (sum, s) => sum + s.count,
        0,
    );

    const statCards = [
        {
            label: 'Pending Approvals',
            value: stats.pending,
            icon: ClipboardCheck,
            accent: 'text-yellow-600 dark:text-yellow-500',
        },
        {
            label: 'Approved',
            value: stats.approved,
            icon: CheckCircle2,
            accent: 'text-green-600 dark:text-green-500',
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            accent: 'text-red-600 dark:text-red-500',
        },
        {
            label: 'Total KPIs',
            value: stats.total,
            icon: ListChecks,
            accent: 'text-muted-foreground',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stat cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {statCards.map(({ label, value, icon: Icon, accent }) => (
                        <Card
                            key={label}
                            className="border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${accent}`} />
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
                            <CardTitle>KPI Status</CardTitle>
                            <CardDescription>
                                All KPIs, university-wide
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {totalKpiStatuses === 0 ? (
                                <EmptyState label="No KPIs submitted yet" />
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
                            <CardTitle>Monthly Submissions</CardTitle>
                            <CardDescription>
                                KPI submissions by status, per month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlySubmissions.length === 0 ? (
                                <EmptyState label="No submissions yet" />
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={monthlySubmissions}>
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
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: 8,
                                                fontSize: 12,
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ fontSize: 12 }}
                                        />
                                        {(
                                            Object.keys(STACK_COLORS) as Array<
                                                keyof typeof STACK_COLORS
                                            >
                                        ).map((key) => (
                                            <Bar
                                                key={key}
                                                dataKey={key}
                                                stackId="submissions"
                                                fill={STACK_COLORS[key]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pending approvals table */}
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Needs Your Review</CardTitle>
                            <CardDescription>
                                Most recently submitted pending KPIs
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/approvals">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {pendingApprovals.length === 0 ? (
                            <EmptyState label="Nothing waiting on you right now" />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>KPI</TableHead>
                                        <TableHead>Sub-KRA</TableHead>
                                        <TableHead>Proposed by</TableHead>
                                        <TableHead>Submitted</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingApprovals.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="max-w-xs truncate">
                                                {item.title}
                                            </TableCell>
                                            <TableCell>{item.subKra}</TableCell>
                                            <TableCell>
                                                {item.proposedBy}
                                            </TableCell>
                                            <TableCell>
                                                {item.submittedAt}
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
