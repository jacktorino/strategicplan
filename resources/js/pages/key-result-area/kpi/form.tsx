import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ResponsibleUnitOption {
    id: number;
    name: string;
    acronym: string | null;
}

interface Props {
    responsibleUnits: ResponsibleUnitOption[];
}

export default function KeyResultAreaKpiForm({ responsibleUnits }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        target: '',
        unit_of_measure: '',
        remarks: '',
        responsible_unit_ids: [] as number[],
    });

    function toggleUnit(unitId: number, checked: boolean) {
        setData(
            'responsible_unit_ids',
            checked
                ? [...data.responsible_unit_ids, unitId]
                : data.responsible_unit_ids.filter((id) => id !== unitId),
        );
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/key-result-area/kpi');
    }

    return (
        <>
            <Head title="Propose a KPI" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
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

                    <h1 className="text-2xl font-bold tracking-tight">
                        Propose a KPI
                    </h1>
                    <p className="text-muted-foreground">
                        Submitted KPIs start as Pending until a strategic
                        planner reviews them.
                    </p>
                </div>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="target">Target</Label>
                                    <Input
                                        id="target"
                                        value={data.target}
                                        onChange={(e) =>
                                            setData('target', e.target.value)
                                        }
                                    />
                                    {errors.target && (
                                        <p className="text-sm text-destructive">
                                            {errors.target}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_of_measure">
                                        Unit of measure
                                    </Label>
                                    <Input
                                        id="unit_of_measure"
                                        value={data.unit_of_measure}
                                        onChange={(e) =>
                                            setData(
                                                'unit_of_measure',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.unit_of_measure && (
                                        <p className="text-sm text-destructive">
                                            {errors.unit_of_measure}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    rows={2}
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData('remarks', e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Responsible units</Label>
                                {responsibleUnits.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">
                                        No responsible units set up yet.
                                    </p>
                                ) : (
                                    <div className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
                                        {responsibleUnits.map((unit) => (
                                            <label
                                                key={unit.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={data.responsible_unit_ids.includes(
                                                        unit.id,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        toggleUnit(
                                                            unit.id,
                                                            checked === true,
                                                        )
                                                    }
                                                />
                                                {unit.acronym ?? unit.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {errors.responsible_unit_ids && (
                                    <p className="text-sm text-destructive">
                                        {errors.responsible_unit_ids}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button asChild variant="outline">
                                    <Link href="/key-result-area/kpi">
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Submit for approval
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
