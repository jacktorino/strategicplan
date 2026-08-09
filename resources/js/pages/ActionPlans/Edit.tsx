import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type StrategicPlan = {
    id: number;
    name: string;
};

type SubKra = {
    id: number;
    code: string;
    name: string;
};

type Kpi = {
    id: number;
    code: string;
    name: string;
    sub_kra: SubKra;
    strategic_plan: StrategicPlan;
};

type OrganizationalUnit = {
    id: number;
    code: string;
    name: string;
};

type ActionPlan = {
    id: number;
    title: string;
    description: string | null;
    organizational_unit_ids: number[];
};

type Props = {
    kpi: Kpi;
    actionPlan: ActionPlan;
    organizationalUnits: OrganizationalUnit[];
};

export default function Edit({ kpi, actionPlan, organizationalUnits }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: actionPlan.title,
        description: actionPlan.description ?? '',
        organizational_unit_ids: actionPlan.organizational_unit_ids ?? [],
    });

    const toggleUnit = (unitId: number) => {
        const isSelected = data.organizational_unit_ids.includes(unitId);

        if (isSelected) {
            setData(
                'organizational_unit_ids',
                data.organizational_unit_ids.filter((id) => id !== unitId),
            );
        } else {
            setData('organizational_unit_ids', [
                ...data.organizational_unit_ids,
                unitId,
            ]);
        }
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/kpis/${kpi.id}/action-plans/${actionPlan.id}`);
    };

    return (
        <>
            <Head title={`Edit ${actionPlan.title}`} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-3xl space-y-6 p-6">
                    {/* Back */}
                    <Link
                        href={`/strategic-plans/${kpi.strategic_plan.id}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Strategic Plan
                    </Link>

                    {/* Header */}
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {kpi.strategic_plan.name}
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Edit Action Plan
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Update the action plan for:
                        </p>

                        <div className="mt-3 rounded-lg border bg-muted/30 p-4">
                            <p className="font-semibold">
                                {kpi.code} — {kpi.name}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {kpi.sub_kra.code} — {kpi.sub_kra.name}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Action Plan Information</CardTitle>

                            <CardDescription>
                                Update the action plan details and responsible
                                organizational units.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>

                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        disabled={processing}
                                    />

                                    {errors.title && (
                                        <p className="text-sm text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>

                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        rows={6}
                                        disabled={processing}
                                    />

                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Responsible Organizational Units */}
                                <div className="space-y-3">
                                    <div>
                                        <Label>
                                            Responsible Organizational Units
                                        </Label>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Select the unit or units responsible
                                            for this action plan.
                                        </p>
                                    </div>

                                    {organizationalUnits.length === 0 ? (
                                        <div className="rounded-lg border p-5 text-sm text-muted-foreground">
                                            No organizational units are
                                            available.
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-lg border">
                                            <div className="divide-y">
                                                {organizationalUnits.map(
                                                    (unit) => {
                                                        const checked =
                                                            data.organizational_unit_ids.includes(
                                                                unit.id,
                                                            );

                                                        return (
                                                            <label
                                                                key={unit.id}
                                                                className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                                                            >
                                                                <Checkbox
                                                                    checked={
                                                                        checked
                                                                    }
                                                                    onCheckedChange={() =>
                                                                        toggleUnit(
                                                                            unit.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                />

                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            unit.name
                                                                        }
                                                                    </p>

                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            unit.code
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {errors.organizational_unit_ids && (
                                        <p className="text-sm text-destructive">
                                            {errors.organizational_unit_ids}
                                        </p>
                                    )}

                                    <p className="text-sm text-muted-foreground">
                                        {data.organizational_unit_ids.length}{' '}
                                        selected
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        disabled={processing}
                                    >
                                        <Link
                                            href={`/strategic-plans/${kpi.strategic_plan.id}`}
                                        >
                                            Cancel
                                        </Link>
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={
                                            processing || !data.title.trim()
                                        }
                                    >
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
