import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    LoaderCircle,
    Copy,
    Check,
    ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';

type SubKra = {
    id: number;
    code: string;
    title: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    sub_kra_id: number | null;
};

type Props = {
    user: User;
    subKras: SubKra[];
};

Create.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'Edit Account',
            href: '/users/edit',
        },
    ],
};

export default function Create() {
    const { user, subKras } = usePage<Props>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        sub_kra_id: user.sub_kra_id ? String(user.sub_kra_id) : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/users/${user.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit User" />

            <div className="p-6">
                <Link
                    href="/users"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Link>

                <div className="m-auto mt-6 max-w-lg">
                    <form onSubmit={submit} className="space-y-5">
                        <h1 className="text-2xl font-bold">Edit Account</h1>
                        <div className="space-y-2">
                            <Label>Name</Label>

                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Full name"
                            />

                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>

                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="email@example.com"
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>

                            <Select
                                value={data.role}
                                onValueChange={(value) =>
                                    setData('role', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="admin">
                                        Administrator
                                    </SelectItem>

                                    <SelectItem value="strategic_planner">
                                        Strategic Planner
                                    </SelectItem>

                                    <SelectItem value="key_result_area">
                                        Key Result Area
                                    </SelectItem>

                                    <SelectItem value="viewer">
                                        Viewer
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.role} />
                        </div>

                        {data.role === 'key_result_area' && (
                            <div className="space-y-2">
                                <Label>Sub KRA</Label>

                                <Select
                                    value={data.sub_kra_id}
                                    onValueChange={(value) =>
                                        setData('sub_kra_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Sub KRA" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {subKras.map((subKra) => (
                                            <SelectItem
                                                key={subKra.id}
                                                value={String(subKra.id)}
                                            >
                                                {subKra.code} - {subKra.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.sub_kra_id} />
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update User
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
