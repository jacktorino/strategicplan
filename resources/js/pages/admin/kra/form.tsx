import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface KraFormData {
    id: number;
    number: string;
    title: string;
    description: string | null;
    order_no: number;
}

interface Props {
    kra?: KraFormData;
}

export default function KraForm({ kra }: Props) {
    const isEditing = !!kra;

    const { data, setData, post, put, processing, errors } = useForm({
        number: kra?.number ?? '',
        title: kra?.title ?? '',
        description: kra?.description ?? '',
        order_no: kra?.order_no ?? 1,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(`/kra/${kra!.id}`);
        } else {
            post('/kra');
        }
    }
    return (
        <>
            <Head title={isEditing ? 'Edit KRA' : 'Add KRA'} />

            <div className="mx-auto max-w-2xl space-y-6 p-6">
                <div>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-4"
                    >
                        <Link href="/kra">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to KRAs
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit KRA' : 'Add KRA'}
                    </h1>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                                <div className="space-y-2">
                                    <Label htmlFor="number">Number</Label>
                                    <Input
                                        id="number"
                                        value={data.number}
                                        onChange={(e) =>
                                            setData('number', e.target.value)
                                        }
                                        placeholder="e.g. 1"
                                    />
                                    {errors.number && (
                                        <p className="text-sm text-destructive">
                                            {errors.number}
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
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:w-40">
                                <Label htmlFor="order_no">Display order</Label>
                                <Input
                                    id="order_no"
                                    type="number"
                                    min={1}
                                    value={data.order_no}
                                    onChange={(e) =>
                                        setData(
                                            'order_no',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                {errors.order_no && (
                                    <p className="text-sm text-destructive">
                                        {errors.order_no}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button asChild variant="outline">
                                    <Link href="/kra">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing ? 'Save changes' : 'Create KRA'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
