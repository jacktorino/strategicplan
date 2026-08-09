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

type Kra = {
    id: number;
    code: string;
    name: string;
    strategic_plan_id: number;
};

type User = {
    id: number;
    name: string;
    email: string;
};

type SubKra = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    owner_id: number | null;
};

type Props = {
    kra: Kra;
    subKra: SubKra;
    users: User[];
};

export default function Edit({ kra, subKra, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        code: subKra.code,
        name: subKra.name,
        description: subKra.description ?? '',
        owner_id: subKra.owner_id ? String(subKra.owner_id) : '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        put(`/kras/${kra.id}/sub-kras/${subKra.id}`);
    };

    return (
        <>
            <Head title={`Edit ${subKra.code}`} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-3xl space-y-6 p-6">
                    <div>
                        <Link
                            href={`/strategic-plans/${kra.strategic_plan_id}`}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Strategic Plan
                        </Link>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            {kra.code} — {kra.name}
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Edit Sub-KRA
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Update the Sub-KRA information and its assigned
                            owner.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {subKra.code} — {subKra.name}
                            </CardTitle>

                            <CardDescription>
                                Modify the details of this Sub-KRA.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Sub-KRA Code</Label>

                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(event) =>
                                            setData('code', event.target.value)
                                        }
                                        placeholder="SKRA-1.1"
                                        disabled={processing}
                                    />

                                    {errors.code && (
                                        <p className="text-sm text-destructive">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Sub-KRA Name</Label>

                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="Curriculum Development"
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
                                        placeholder="Describe the focus of this supporting area..."
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
                                    <Label htmlFor="owner_id">Owner</Label>

                                    <UserCombobox
                                        id="owner_id"
                                        users={users}
                                        value={data.owner_id}
                                        onChange={(value) =>
                                            setData('owner_id', value)
                                        }
                                        placeholder="Select an owner"
                                        emptyOptionLabel="No owner assigned"
                                        disabled={processing}
                                    />

                                    {errors.owner_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.owner_id}
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
                                            href={`/strategic-plans/${kra.strategic_plan_id}`}
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
