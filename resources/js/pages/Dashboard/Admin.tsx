import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Target,
    KeyRound,
    Users,
    ClipboardCheck,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

// ---- Types -----------------------------------------------------------
// Shape this page expects from DashboardController@index. Adjust field
// names to match whatever your controller actually sends; the fallbacks
// below keep the page from crashing if a section isn't wired up yet.

interface StatCard {
    label: string;
    value: number;
    delta?: number; // e.g. +12 (%) vs last period. Omit if not tracked.
}

interface KpiStatusSlice {
    status: 'approved' | 'pending' | 'rejected' | 'completed';
    count: number;
}

interface KraBreakdownItem {
    kra: string; // e.g. "KRA 1", or a short title
    total: number;
    completed: number;
}

interface MonthlyProgressPoint {
    month: string; // e.g. "Jan", "Feb"
    accomplishment: number; // average % accomplishment that month
}

interface DashboardProps {
    stats?: {
        strategicPlans: number;
        kras: number;
        kpis: number;
        users: number;
    };
    kpiStatusBreakdown?: KpiStatusSlice[];
    kraBreakdown?: KraBreakdownItem[];
    monthlyProgress?: MonthlyProgressPoint[];
}

// ---- Chart theme -------------------------------------------------------
// Uses shadcn theme CSS variables so colors adapt automatically to light/dark
// mode. --chart-1 through --chart-5 come from the shadcn chart preset for
// categorical data; --primary is reserved for the "emphasis" series
// (completed KPIs, accomplishment trend) to tie it to your brand color.

const STATUS_COLORS: Record<KpiStatusSlice['status'], string> = {
    approved: 'var(--chart-2)',
    pending: 'var(--chart-4)',
    rejected: 'var(--chart-5)',
    completed: 'var(--primary)',
};

const STATUS_LABELS: Record<KpiStatusSlice['status'], string> = {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    completed: 'Completed',
};

const AXIS_STYLE = {
    fontSize: 12,
    fill: 'var(--muted-foreground)',
};

export default function Admin({
    stats = { strategicPlans: 0, kras: 0, kpis: 0, users: 0 },
    kpiStatusBreakdown = [],
    kraBreakdown = [],
    monthlyProgress = [],
}: DashboardProps) {
    const totalKpiStatuses = kpiStatusBreakdown.reduce(
        (sum, s) => sum + s.count,
        0,
    );

    const statCards: (StatCard & { icon: typeof Target })[] = [
        { label: 'Strategic Plans', value: stats.strategicPlans, icon: Target },
        { label: 'Key Result Areas', value: stats.kras, icon: ClipboardCheck },
        { label: 'KPIs', value: stats.kpis, icon: KeyRound },
        { label: 'Users', value: stats.users, icon: Users },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stat cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {statCards.map(({ label, value, delta, icon: Icon }) => (
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
                                {typeof delta === 'number' && (
                                    <p
                                        className={`flex items-center gap-1 text-xs ${
                                            delta >= 0
                                                ? 'text-green-600 dark:text-green-500'
                                                : 'text-red-600 dark:text-red-500'
                                        }`}
                                    >
                                        {delta >= 0 ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3" />
                                        )}
                                        {Math.abs(delta)}% vs last period
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* KPI status breakdown */}
                    <Card className="border-sidebar-border/70 md:col-span-1 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>KPI Status</CardTitle>
                            <CardDescription>
                                Approval breakdown across all submitted KPIs
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
                                                contentStyle={{
                                                    backgroundColor:
                                                        'var(--background)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 8,
                                                    fontSize: 12,
                                                }}
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

                    {/* KRA breakdown */}
                    <Card className="border-sidebar-border/70 md:col-span-2 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>KPIs per Key Result Area</CardTitle>
                            <CardDescription>
                                Total vs. completed KPIs for each KRA
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {kraBreakdown.length === 0 ? (
                                <EmptyState label="No KRA data yet" />
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={kraBreakdown}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--border)"
                                        />
                                        <XAxis
                                            dataKey="kra"
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
                                                    'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 8,
                                                fontSize: 12,
                                            }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            name="Total KPIs"
                                            fill="color-mix(in oklch, var(--primary) 30%, transparent)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="completed"
                                            name="Completed"
                                            fill="var(--primary)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly progress trend */}
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Accomplishment Trend</CardTitle>
                        <CardDescription>
                            Average KPI accomplishment rate by month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {monthlyProgress.length === 0 ? (
                            <EmptyState label="No progress entries recorded yet" />
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={monthlyProgress}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
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
                                                'var(--background)',
                                            border: '1px solid var(--border)',
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
                                        stroke="var(--primary)"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: 'var(--primary)' }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
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
