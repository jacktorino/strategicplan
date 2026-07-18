import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface KraOption {
    id: number;
    number: string;
    title: string;
}

interface SubKraFormData {
    id: number;
    kra_id: number;
    code: string;
    title: string;
    order_no: number;
}

interface Props {
    subKra?: SubKraFormData;
    kras: KraOption[];
    selectedKraId?: number | null;
}

export default function SubKraForm({ subKra, kras, selectedKraId }: Props) {
    const isEditing = !!subKra;

    const { data, setData, post, put, processing, errors } = useForm({
        kra_id: subKra?.kra_id ?? selectedKraId ?? undefined,
        code: subKra?.code ?? '',
        title: subKra?.title ?? '',
        order_no: subKra?.order_no ?? 1,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(`/subkra/${subKra.id}`);
        } else {
            post('/subkra');
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Sub KRA' : 'Add Sub KRA'} />

            <div className="mx-auto max-w-2xl space-y-6 p-6">
                <div>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mb-3 -ml-4"
                    >
                        <Link href="/subkra">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sub KRAs
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Sub KRA' : 'Add Sub KRA'}
                    </h1>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kra_id">KRA</Label>
                                <Select
                                    value={
                                        data.kra_id
                                            ? String(data.kra_id)
                                            : undefined
                                    }
                                    onValueChange={(value) =>
                                        setData('kra_id', Number(value))
                                    }
                                >
                                    <SelectTrigger id="kra_id">
                                        <SelectValue placeholder="Select a KRA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kras.map((kra) => (
                                            <SelectItem
                                                key={kra.id}
                                                value={String(kra.id)}
                                            >
                                                KRA {kra.number} — {kra.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kra_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.kra_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="e.g. 1.1"
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">
                                            {errors.code}
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
                                    <Link href="/subkra">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing
                                        ? 'Save changes'
                                        : 'Create Sub KRA'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
