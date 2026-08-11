import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    kpi: {
        id: number;
        code: string;
        name: string;
        sub_kra: { id: number; code: string; name: string };
        strategic_plan: { id: number; name: string };
    };
    organizationalUnits: Array<{ id: number; code: string; name: string }>;
}

export default function ActionPlansCreate({ kpi, organizationalUnits }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        organizational_unit_ids: [] as number[],
    });

    const handleUnitToggle = (id: number) => {
        if (data.organizational_unit_ids.includes(id)) {
            setData('organizational_unit_ids', data.organizational_unit_ids.filter((uId) => uId !== id));
        } else {
            setData('organizational_unit_ids', [...data.organizational_unit_ids, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/kpis/${kpi.id}/action-plans`);
    };

    return (
        <>
            <Head title={`Create Action Plan - ${kpi.code}`} />
            <div className="mx-auto max-w-3xl p-6">
                <Link href="/my-sub-kra/action-plans" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" /> Back to Action Plans
                </Link>

                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.strategic_plan.name} / {kpi.sub_kra.name}</span>
                        <h1 className="text-xl font-bold">Create Action Plan for KPI: {kpi.code}</h1>
                        <p className="text-sm text-muted-foreground">{kpi.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                placeholder="e.g. Conduct annual faculty research development workshop"
                            />
                            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                placeholder="Detailed operational steps and objectives..."
                            />
                            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Responsible Organizational Units</label>
                            <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto rounded-lg border bg-background p-3 sm:grid-cols-2">
                                {organizationalUnits.map((unit) => (
                                    <label key={unit.id} className="flex cursor-pointer items-center gap-2 rounded p-2 text-sm hover:bg-muted/50">
                                        <input
                                            type="checkbox"
                                            checked={data.organizational_unit_ids.includes(unit.id)}
                                            onChange={() => handleUnitToggle(unit.id)}
                                            className="rounded border-input text-primary"
                                        />
                                        <span><strong className="font-semibold">[{unit.code}]</strong> {unit.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.organizational_unit_ids && <p className="mt-1 text-xs text-destructive">{errors.organizational_unit_ids}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link href="/my-sub-kra/action-plans" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Action Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}