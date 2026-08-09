import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

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

type SubKra = {
    id: number;
    code: string;
    name: string;
};

type Props = {
    subKra: SubKra;
};

type KpiForm = {
    code: string;
    name: string;
    description: string;
};

export default function Create({ subKra }: Props) {
    const { data, setData, post, processing, errors } = useForm<KpiForm>({
        code: '',
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(`/sub-kras/${subKra.id}/kpis`);
    };

    return (
        <>
            <Head title="Create KPI" />

            <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <Card>
                    <CardHeader>
                        <CardTitle>Create KPI</CardTitle>

                        <CardDescription>
                            Add a new key performance indicator under{' '}
                            <span className="font-medium text-foreground">
                                {subKra.code} — {subKra.name}
                            </span>
                            .
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code</Label>

                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                    placeholder="e.g. KPI-1.1.1"
                                    autoFocus
                                />

                                {errors.code && (
                                    <p className="text-sm text-destructive">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g. Graduate employment rate"
                                />

                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>

                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Optional details about this KPI"
                                    rows={4}
                                />

                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="text-sm font-medium text-muted-foreground hover:underline"
                                >
                                    Cancel
                                </button>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create KPI'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
