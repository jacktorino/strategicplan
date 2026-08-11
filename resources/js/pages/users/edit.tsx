import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    roles: string[];
}

export default function UsersEdit({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <div className="mx-auto max-w-2xl p-6">
                <Link href="/users" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" /> Back to Users
                </Link>

                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                    <h1 className="mb-6 text-xl font-bold">Edit User Account</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-background"
                            />
                            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-background"
                            />
                            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">New Password <span className="text-xs text-muted-foreground">(Leave blank to keep current password)</span></label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-background"
                            />
                            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Assigned Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-background capitalize"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Updating User...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}