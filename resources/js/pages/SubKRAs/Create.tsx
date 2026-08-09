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

type Props = {
    kra: Kra;
    users: User[];
};

export default function Create({ kra, users }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        description: '',
        owner_id: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(`/kras/${kra.id}/sub-kras`);
    };

    return (
        <>
            <Head title="Create Sub-KRA" />

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
                            Create Sub-KRA
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Add a supporting area under this KRA.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sub-KRA Information</CardTitle>

                            <CardDescription>
                                Define the Sub-KRA and assign an owner
                                responsible for it.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Code */}
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

                                {/* Name */}
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

                                {/* Owner */}
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
                                        disabled={processing}
                                    />

                                    {errors.owner_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.owner_id}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
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
                                            ? 'Creating...'
                                            : 'Create Sub-KRA'}
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
