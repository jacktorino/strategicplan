import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Target, Trash2 } from 'lucide-react';

interface ActionPlanItem {
    id: number;
    title: string;
    description: string;
    kpi: {
        id: number;
        code: string;
        name: string;
    };
    units_count: number;
}

interface Props {
    actionPlans?: {
        data: ActionPlanItem[];
    };
    kpis?: Array<{ id: number; code: string; name: string }>;
}

export default function MySubKraActionPlans({ actionPlans, kpis }: Props) {
    const plansList = actionPlans?.data || [];

    const handleDelete = (kpiId: number, planId: number, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            router.delete(`/kpis/${kpiId}/action-plans/${planId}`);
        }
    };

    return (
        <>
            <Head title="Sub-KRA Action Plans" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Sub-KRA Action Plans</h1>
                        <p className="text-sm text-muted-foreground">Manage action plans, assign responsible units, and monitor progress.</p>
                    </div>

                    {kpis && kpis.length > 0 && (
                        <Link
                            href={`/kpis/${kpis[0].id}/action-plans/create`}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            <Plus className="size-4" />
                            Create Action Plan
                        </Link>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3">KPI Code</th>
                                <th className="px-6 py-3">Action Plan Title</th>
                                <th className="px-6 py-3">Responsible Units</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-sidebar-border/50">
                            {plansList.length > 0 ? (
                                plansList.map((plan) => (
                                    <tr key={plan.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-6 py-4 font-semibold text-primary">
                                            <span className="inline-flex items-center gap-1">
                                                <Target className="size-3.5" />
                                                {plan.kpi?.code || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{plan.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{plan.units_count || 0} unit(s)</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/action-plans/${plan.id}`}
                                                    className="inline-flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                                    title="View Details"
                                                >
                                                    <Eye className="size-3.5" />
                                                </Link>
                                                {plan.kpi && (
                                                    <Link
                                                        href={`/kpis/${plan.kpi.id}/action-plans/${plan.id}/edit`}
                                                        className="inline-flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                                        title="Edit Plan"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Link>
                                                )}
                                                {plan.kpi && (
                                                    <button
                                                        onClick={() => handleDelete(plan.kpi.id, plan.id, plan.title)}
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-destructive/20 text-destructive transition-colors hover:bg-destructive/10"
                                                        title="Delete Plan"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                        No action plans found for your Sub-KRAs.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}