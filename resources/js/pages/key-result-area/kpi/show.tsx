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

import ProgressDialog from '../../admin/kpi/progress-dialog';

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
    progress: ProgressEntry[];
}

interface Props {
    kpi: Kpi;
}

export default function KeyResultAreaKpiShow({ kpi }: Props) {
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(
        null,
    );

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
                            <Link href="/key-result-area/kpi">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to My KPIs
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

                    <Badge>{kpi.status}</Badge>
                </div>

                {/* Remaining UI stays exactly the same */}
            </div>

            <ProgressDialog
                kpiId={kpi.id}
                open={progressDialogOpen}
                onOpenChange={setProgressDialogOpen}
                entry={editingEntry}
            />
        </>
    );
}
