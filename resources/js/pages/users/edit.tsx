import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Unit {
    id: number;
    code: string;
    name: string;
}

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        organizational_unit_id: number | null;
    };
    roles: string[];
    units: Unit[];
}

export default function UsersEdit({ user, roles, units }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        organizational_unit_id: user.organizational_unit_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <div className="mx-auto max-w-2xl p-6">
                <Link
                    href="/users"
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" /> Back to Users
                </Link>

                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    <h1 className="mb-6 text-xl font-bold">
                        Edit User Account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                New Password{' '}
                                <span className="text-xs text-muted-foreground">
                                    (Leave blank to keep current password)
                                </span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Assigned Role
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) =>
                                    setData('role', e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm capitalize"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Organizational Unit
                            </label>
                            <select
                                value={data.organizational_unit_id}
                                onChange={(e) =>
                                    setData(
                                        'organizational_unit_id',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            >
                                <option value="">
                                    -- Select Organizational Unit --
                                </option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.code})
                                    </option>
                                ))}
                            </select>
                            {errors.organizational_unit_id && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.organizational_unit_id}
                                </p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing
                                    ? 'Updating User...'
                                    : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
