import { Head, Link, router, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface StrategicPlan {
    id: number;
    title: string;
    school_year: string;
    description?: string;
    status: 'Draft' | 'Active' | 'Archived';
    creator?: { name: string };
    kras_count?: number;
}

interface Props {
    plans?: StrategicPlan[];
}

type PlanFormData = {
    title: string;
    school_year: string;
    description: string;
    status: 'Draft' | 'Active' | 'Archived';
};

export default function StrategicPlan({ plans = [] }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<StrategicPlan | null>(null);

    // ----- Create -----
    const createForm = useForm<PlanFormData>({
        title: '',
        school_year: '',
        description: '',
        status: 'Draft',
    });

    function handleCreateSubmit(e: FormEvent) {
        e.preventDefault();

        createForm.post('/strategic-plans', {
            onSuccess: () => {
                createForm.reset();
                setCreateOpen(false);
            },
        });
    }

    // ----- Edit -----
    const editForm = useForm<PlanFormData>({
        title: '',
        school_year: '',
        description: '',
        status: 'Draft',
    });

    function openEdit(plan: StrategicPlan) {
        setEditingPlan(plan);
        editForm.setData({
            title: plan.title,
            school_year: plan.school_year,
            description: plan.description ?? '',
            status: plan.status,
        });
        editForm.clearErrors();
    }

    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();
        if (!editingPlan) return;

        editForm.put(`/strategic-plans/${editingPlan.id}`, {
            onSuccess: () => {
                setEditingPlan(null);
                editForm.reset();
            },
        });
    }

    // ----- Delete -----
    function handleDelete(plan: StrategicPlan) {
        const kraWarning = plan.kras_count
            ? ` This will also permanently delete ${plan.kras_count} associated KRA${plan.kras_count === 1 ? '' : 's'}.`
            : '';

        if (
            !confirm(
                `Delete "${plan.title}"?${kraWarning} This cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(`/strategic-plans/${plan.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Strategic Plans
                        </h1>
                        <p className="text-muted-foreground">
                            Create and manage organizational strategic plans.
                        </p>
                    </div>

                    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Strategic Plan
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-full overflow-y-auto p-10 sm:w-[60vw] sm:max-w-none"
                        >
                            <SheetHeader>
                                <SheetTitle>New Strategic Plan</SheetTitle>
                                <SheetDescription>
                                    Fill in the information below to create a
                                    new strategic plan.
                                </SheetDescription>
                            </SheetHeader>

                            <form
                                onSubmit={handleCreateSubmit}
                                className="mt-8 space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Strategic Plan 2026–2030"
                                        value={createForm.data.title}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {createForm.errors.title && (
                                        <p className="text-sm text-destructive">
                                            {createForm.errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="school_year">
                                        Academic Year
                                    </Label>
                                    <Input
                                        id="school_year"
                                        placeholder="2026-2030"
                                        value={createForm.data.school_year}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'school_year',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {createForm.errors.school_year && (
                                        <p className="text-sm text-destructive">
                                            {createForm.errors.school_year}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={6}
                                        placeholder="Enter a short description..."
                                        value={createForm.data.description}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={createForm.data.status}
                                        onValueChange={(value) =>
                                            createForm.setData(
                                                'status',
                                                value as PlanFormData['status'],
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="Active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="Archived">
                                                Archived
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreateOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createForm.processing}
                                    >
                                        Save Strategic Plan
                                    </Button>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Edit Sheet — controlled by editingPlan, no visible trigger */}
                <Sheet
                    open={editingPlan !== null}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setEditingPlan(null);
                    }}
                >
                    <SheetContent
                        side="right"
                        className="w-full overflow-y-auto p-10 sm:w-[60vw] sm:max-w-none"
                    >
                        <SheetHeader>
                            <SheetTitle>Edit Strategic Plan</SheetTitle>
                            <SheetDescription>
                                Update the details of this strategic plan.
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            onSubmit={handleEditSubmit}
                            className="mt-8 space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.title && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-school_year">
                                    Academic Year
                                </Label>
                                <Input
                                    id="edit-school_year"
                                    value={editForm.data.school_year}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'school_year',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.school_year && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.school_year}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    rows={6}
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(value) =>
                                        editForm.setData(
                                            'status',
                                            value as PlanFormData['status'],
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="Active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="Archived">
                                            Archived
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingPlan(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Update Strategic Plan
                                </Button>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search strategic plans..."
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Strategic Plans</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {plans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FileText className="mb-4 h-14 w-14 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    No Strategic Plans Found
                                </h3>
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    Create your first strategic plan to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/40">
                                        <tr className="border-b">
                                            <th className="px-6 py-4 text-left">
                                                Title
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                Academic Year
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                Created By
                                            </th>
                                            <th className="px-6 py-4 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {plans.map((plan) => (
                                            <tr
                                                key={plan.id}
                                                className="border-b hover:bg-muted/40"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">
                                                        {plan.title}
                                                    </div>
                                                    {plan.description && (
                                                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                                            {plan.description}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {plan.school_year}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={
                                                            plan.status ===
                                                            'Active'
                                                                ? 'default'
                                                                : plan.status ===
                                                                    'Draft'
                                                                  ? 'secondary'
                                                                  : 'outline'
                                                        }
                                                    >
                                                        {plan.status}
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {plan.creator?.name ?? '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/strategic-plans/${plan.id}`}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEdit(plan)
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    plan,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
