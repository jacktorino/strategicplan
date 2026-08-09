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

type Props = {
    strategicPlan: StrategicPlan;
    users: User[];
};

export default function Create({ strategicPlan, users }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        description: '',
        champion_id: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(`/strategic-plans/${strategicPlan.id}/kras`);
    };

    return (
        <>
            <Head title="Create KRA" />

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
                            Create KRA
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Add a Key Result Area to this strategic plan.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>KRA Information</CardTitle>

                            <CardDescription>
                                Define the KRA and assign a champion responsible
                                for it.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Code */}
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

                                {/* Name */}
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

                                {/* Champion */}
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
                                        disabled={processing}
                                    />

                                    {errors.champion_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.champion_id}
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
                                            href={`/strategic-plans/${strategicPlan.id}`}
                                        >
                                            Cancel
                                        </Link>
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Creating...'
                                            : 'Create KRA'}
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
