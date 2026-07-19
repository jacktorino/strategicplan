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
import { ChevronLeft, LoaderCircle, Copy, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

type SubKra = {
    id: number;
    code: string;
    title: string;
};

type Props = {
    subKras: SubKra[];
    flash: {
        success?: string;
        temporary_password?: string;
    };
};

Create.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'Create Account',
            href: '/users/create',
        },
    ],
};

export default function Create() {
    const { subKras } = usePage<Props>().props;

    const flash =
        (usePage().props.flash as {
            success?: string;
            temporary_password?: string;
        }) ?? {};
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        sub_kra_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/users', {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'email', 'role', 'sub_kra_id');
            },
        });
    };

    const copyPassword = async () => {
        if (!flash.temporary_password) return;

        await navigator.clipboard.writeText(flash.temporary_password);

        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Head title="Create User" />

            <div className="p-6">
                <Link
                    href="/users"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Link>

                <div className="m-auto mt-6 max-w-lg">
                    {flash.temporary_password && (
                        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-50 p-5 dark:bg-green-500/10">
                            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                                User created successfully
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Temporary Password
                            </p>

                            <div className="mt-3 flex items-center justify-between rounded-lg border bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                                <span className="font-mono text-lg font-semibold tracking-wider text-green-700 dark:text-green-400">
                                    {flash.temporary_password}
                                </span>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={copyPassword}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            <p className="mt-3 text-sm text-muted-foreground">
                                Give this password to the user. They should
                                change it after their first login.
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <h1 className="text-2xl font-bold">
                            Create a new account
                        </h1>
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
                            Create User
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
