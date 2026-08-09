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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCombobox } from '@/components/user-combobox';

type StrategicPlan = {
    id: number;
    name: string;
    academic_year: string;
};

type User = {
    id: number;
    name: string;
    email: string;
};

type Kra = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    champion_id: number | null;
};

type Props = {
    strategicPlan: StrategicPlan;
    kra: Kra;
    users: User[];
};

export default function Edit({ strategicPlan, kra, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        code: kra.code,
        name: kra.name,
        description: kra.description ?? '',
        champion_id: kra.champion_id ? String(kra.champion_id) : '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        put(`/strategic-plans/${strategicPlan.id}/kras/${kra.id}`);
    };

    return (
        <>
            <Head title={`Edit ${kra.code}`} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-3xl space-y-6 p-6">
                    <div>
                        <Link
                            href={`/strategic-plans/${strategicPlan.id}`}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Strategic Plan
                        </Link>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            {strategicPlan.name}
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Edit KRA
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Update the KRA information and its assigned
                            champion.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {kra.code} — {kra.name}
                            </CardTitle>

                            <CardDescription>
                                Modify the details of this Key Result Area.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code">KRA Code</Label>

                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(event) =>
                                            setData('code', event.target.value)
                                        }
                                        placeholder="KRA-1"
                                        disabled={processing}
                                    />

                                    {errors.code && (
                                        <p className="text-sm text-destructive">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">KRA Name</Label>

                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="Quality Education"
                                        disabled={processing}
                                    />

                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

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
                                        placeholder="Describe the strategic objective of this KRA..."
                                        rows={5}
                                        disabled={processing}
                                    />

                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="champion_id">
                                        KRA Champion
                                    </Label>

                                    <UserCombobox
                                        id="champion_id"
                                        users={users}
                                        value={data.champion_id}
                                        onChange={(value) =>
                                            setData('champion_id', value)
                                        }
                                        placeholder="Select a champion"
                                        emptyOptionLabel="No champion assigned"
                                        disabled={processing}
                                    />

                                    {errors.champion_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.champion_id}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        disabled={processing}
                                    >
                                        <Link
                                            href={`/strategic-plans/${strategicPlan.id}`}
                                        >
                                            Cancel
                                        </Link>
                                    </Button>

                                    <Button type="submit" disabled={processing}>
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
