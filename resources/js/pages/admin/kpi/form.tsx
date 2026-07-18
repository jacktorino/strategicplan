import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SubKraOption {
    id: number;
    code: string;
    title: string;
    kra: { number: string };
}

interface ResponsibleUnitOption {
    id: number;
    name: string;
    acronym: string | null;
}

interface KpiFormData {
    id: number;
    sub_kra_id: number;
    title: string;
    description: string | null;
    target: string | null;
    unit_of_measure: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    remarks: string | null;
    responsible_units: ResponsibleUnitOption[];
}

interface Props {
    kpi?: KpiFormData;
    subKras: SubKraOption[];
    responsibleUnits: ResponsibleUnitOption[];
    selectedSubKraId?: number | null;
}

const STATUS_OPTIONS = [
    'Pending',
    'Approved',
    'Rejected',
    'Completed',
] as const;

export default function KpiForm({
    kpi,
    subKras,
    responsibleUnits,
    selectedSubKraId,
}: Props) {
    const isEditing = !!kpi;

    const { data, setData, post, put, processing, errors } = useForm({
        sub_kra_id: kpi?.sub_kra_id ?? selectedSubKraId ?? undefined,
        title: kpi?.title ?? '',
        description: kpi?.description ?? '',
        target: kpi?.target ?? '',
        unit_of_measure: kpi?.unit_of_measure ?? '',
        status: kpi?.status ?? 'Pending',
        remarks: kpi?.remarks ?? '',
        responsible_unit_ids:
            kpi?.responsible_units.map((u) => u.id) ?? ([] as number[]),
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

        if (isEditing && kpi) {
            put(`/kpi/${kpi.id}`);
        } else {
            post('/kpi');
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit KPI' : 'Add KPI'} />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-4"
                    >
                        <Link href="/kpi">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to KPIs
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit KPI' : 'Add KPI'}
                    </h1>
                </div>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sub_kra_id">Sub KRA</Label>
                                <Select
                                    value={
                                        data.sub_kra_id
                                            ? String(data.sub_kra_id)
                                            : undefined
                                    }
                                    onValueChange={(value) =>
                                        setData('sub_kra_id', Number(value))
                                    }
                                >
                                    <SelectTrigger id="sub_kra_id">
                                        <SelectValue placeholder="Select a Sub KRA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subKras.map((sub) => (
                                            <SelectItem
                                                key={sub.id}
                                                value={String(sub.id)}
                                            >
                                                KRA {sub.kra.number} ·{' '}
                                                {sub.code} — {sub.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sub_kra_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.sub_kra_id}
                                    </p>
                                )}
                            </div>

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
                                    value={data.description ?? ''}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="target">Target</Label>
                                    <Input
                                        id="target"
                                        value={data.target ?? ''}
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
                                        value={data.unit_of_measure ?? ''}
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

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData(
                                                'status',
                                                value as KpiFormData['status'],
                                            )
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((status) => (
                                                <SelectItem
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    rows={2}
                                    value={data.remarks ?? ''}
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
                                    <Link href="/kpi">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing ? 'Save changes' : 'Create KPI'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
