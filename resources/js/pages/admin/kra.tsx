import { Head, router, useForm } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Plus, Pencil } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface StrategicPlanSummary {
    id: number;
    title: string;
    school_year: string;
}

interface Kra {
    id: number;
    number: string;
    title: string;
    description: string | null;
    order_no: number;
    strategic_plan_id: number;
    strategic_plan?: StrategicPlanSummary;
}

interface Props {
    kras: Kra[];
    strategicPlans: StrategicPlanSummary[];
    filters: {
        strategic_plan_id?: string;
    };
}

type KraFormData = {
    strategic_plan_id: string;
    number: string;
    title: string;
    description: string;
    order_no: number;
};

export default function Kra({ kras, strategicPlans, filters }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingKra, setEditingKra] = useState<Kra | null>(null);

    // ----- Table filter -----
    function handlePlanFilterChange(value: string) {
        router.get(
            '/kra',
            value === 'all' ? {} : { strategic_plan_id: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    // ----- Create form -----
    const createForm = useForm<KraFormData>({
        strategic_plan_id: '',
        number: '',
        title: '',
        description: '',
        order_no: 1,
    });

    // KRAs belonging to whichever plan is currently selected in the create form
    const existingKrasForSelectedPlan = useMemo(() => {
        if (!createForm.data.strategic_plan_id) return [];

        return kras.filter(
            (kra) =>
                String(kra.strategic_plan_id) ===
                createForm.data.strategic_plan_id,
        );
    }, [createForm.data.strategic_plan_id, kras]);

    const selectedPlan = strategicPlans.find(
        (plan) => String(plan.id) === createForm.data.strategic_plan_id,
    );

    function handleCreateSubmit(e: FormEvent) {
        e.preventDefault();

        createForm.post('/kra', {
            onSuccess: () => {
                createForm.reset();
                setCreateOpen(false);
            },
        });
    }

    function handleSheetOpenChange(isOpen: boolean) {
        setCreateOpen(isOpen);
        if (!isOpen) {
            createForm.reset();
            createForm.clearErrors();
        }
    }

    // ----- Edit form -----
    const editForm = useForm<KraFormData>({
        strategic_plan_id: '',
        number: '',
        title: '',
        description: '',
        order_no: 1,
    });

    function openEdit(kra: Kra) {
        setEditingKra(kra);
        editForm.setData({
            strategic_plan_id: String(kra.strategic_plan_id),
            number: kra.number,
            title: kra.title,
            description: kra.description ?? '',
            order_no: kra.order_no,
        });
        editForm.clearErrors();
    }

    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();
        if (!editingKra) return;

        editForm.put(`/kra/${editingKra.id}`, {
            onSuccess: () => {
                setEditingKra(null);
                editForm.reset();
            },
        });
    }

    function handleEditSheetOpenChange(isOpen: boolean) {
        if (!isOpen) {
            setEditingKra(null);
            editForm.reset();
            editForm.clearErrors();
        }
    }

    return (
        <>
            <Head title="Key Result Areas" />

            <div className="container mx-8 py-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold">Key Result Areas</h1>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="w-full sm:w-64">
                            <Select
                                value={filters.strategic_plan_id ?? 'all'}
                                onValueChange={handlePlanFilterChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Strategic Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Strategic Plans
                                    </SelectItem>
                                    {strategicPlans.map((plan) => (
                                        <SelectItem
                                            key={plan.id}
                                            value={String(plan.id)}
                                        >
                                            {plan.title} ({plan.school_year})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Sheet
                            open={createOpen}
                            onOpenChange={handleSheetOpenChange}
                        >
                            <SheetTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New KRA
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-full overflow-y-auto p-10 sm:w-[60vw] sm:max-w-none"
                            >
                                <SheetHeader>
                                    <SheetTitle>New KRA</SheetTitle>
                                    <SheetDescription>
                                        Pick a Strategic Plan / Academic Year,
                                        then add a Key Result Area to it.
                                    </SheetDescription>
                                </SheetHeader>

                                <form
                                    onSubmit={handleCreateSubmit}
                                    className="mt-8 space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="strategic_plan_id">
                                            Academic Year (Strategic Plan)
                                        </Label>
                                        <Select
                                            value={
                                                createForm.data
                                                    .strategic_plan_id
                                            }
                                            onValueChange={(value) =>
                                                createForm.setData(
                                                    'strategic_plan_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="strategic_plan_id">
                                                <SelectValue placeholder="Select a Strategic Plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {strategicPlans.map((plan) => (
                                                    <SelectItem
                                                        key={plan.id}
                                                        value={String(plan.id)}
                                                    >
                                                        {plan.title} (
                                                        {plan.school_year})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors
                                            .strategic_plan_id && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    createForm.errors
                                                        .strategic_plan_id
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Existing KRAs for the selected plan */}
                                    {createForm.data.strategic_plan_id && (
                                        <div className="rounded-md border bg-muted/30 p-4">
                                            <p className="mb-2 text-sm font-medium">
                                                Existing KRAs for{' '}
                                                {selectedPlan?.title}
                                            </p>

                                            {existingKrasForSelectedPlan.length ===
                                            0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    No KRAs yet for this plan.
                                                </p>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {existingKrasForSelectedPlan.map(
                                                        (kra) => (
                                                            <li
                                                                key={kra.id}
                                                                className="flex items-center justify-between text-sm"
                                                            >
                                                                <span>
                                                                    KRA{' '}
                                                                    {kra.number}{' '}
                                                                    —{' '}
                                                                    {kra.title}
                                                                </span>
                                                                <Badge variant="outline">
                                                                    Order{' '}
                                                                    {
                                                                        kra.order_no
                                                                    }
                                                                </Badge>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="number">Number</Label>
                                        <Input
                                            id="number"
                                            placeholder="1"
                                            value={createForm.data.number}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    'number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {createForm.errors.number && (
                                            <p className="text-sm text-destructive">
                                                {createForm.errors.number}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Improve student outcomes"
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
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            rows={5}
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
                                        <Label htmlFor="order_no">Order</Label>
                                        <Input
                                            id="order_no"
                                            type="number"
                                            min={1}
                                            value={createForm.data.order_no}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    'order_no',
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                        {createForm.errors.order_no && (
                                            <p className="text-sm text-destructive">
                                                {createForm.errors.order_no}
                                            </p>
                                        )}
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
                                            Save KRA
                                        </Button>
                                    </div>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Edit Sheet — controlled by editingKra, no visible trigger */}
                <Sheet
                    open={editingKra !== null}
                    onOpenChange={handleEditSheetOpenChange}
                >
                    <SheetContent
                        side="right"
                        className="w-full overflow-y-auto p-10 sm:w-[60vw] sm:max-w-none"
                    >
                        <SheetHeader>
                            <SheetTitle>Edit KRA</SheetTitle>
                            <SheetDescription>
                                Update the details of this Key Result Area.
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            onSubmit={handleEditSubmit}
                            className="mt-8 space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="edit-strategic_plan_id">
                                    Academic Year (Strategic Plan)
                                </Label>
                                <Select
                                    value={editForm.data.strategic_plan_id}
                                    onValueChange={(value) =>
                                        editForm.setData(
                                            'strategic_plan_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit-strategic_plan_id">
                                        <SelectValue placeholder="Select a Strategic Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {strategicPlans.map((plan) => (
                                            <SelectItem
                                                key={plan.id}
                                                value={String(plan.id)}
                                            >
                                                {plan.title} ({plan.school_year}
                                                )
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.strategic_plan_id && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.strategic_plan_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-number">Number</Label>
                                <Input
                                    id="edit-number"
                                    value={editForm.data.number}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'number',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.number && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.number}
                                    </p>
                                )}
                            </div>

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
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    rows={5}
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
                                <Label htmlFor="edit-order_no">Order</Label>
                                <Input
                                    id="edit-order_no"
                                    type="number"
                                    min={1}
                                    value={editForm.data.order_no}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'order_no',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                {editForm.errors.order_no && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.order_no}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingKra(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Update KRA
                                </Button>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>

                {(() => {
                    const grouped = new Map<
                        number,
                        { plan?: StrategicPlanSummary; items: Kra[] }
                    >();

                    kras.forEach((kra) => {
                        const key = kra.strategic_plan_id;
                        if (!grouped.has(key)) {
                            grouped.set(key, {
                                plan: kra.strategic_plan,
                                items: [],
                            });
                        }
                        grouped.get(key)!.items.push(kra);
                    });

                    if (kras.length === 0) {
                        return (
                            <div className="rounded-md border">
                                <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                                    No KRAs found.
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="space-y-8">
                            {Array.from(grouped.entries()).map(
                                ([planId, group]) => (
                                    <div key={planId}>
                                        <h2 className="mb-3 text-lg font-semibold">
                                            {group.plan?.title ??
                                                `Strategic Plan #${planId}`}
                                            {group.plan?.school_year && (
                                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                    ({group.plan.school_year})
                                                </span>
                                            )}
                                        </h2>

                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-24">
                                                            Number
                                                        </TableHead>
                                                        <TableHead>
                                                            Title
                                                        </TableHead>
                                                        <TableHead>
                                                            Description
                                                        </TableHead>
                                                        <TableHead className="w-24 text-center">
                                                            Order
                                                        </TableHead>
                                                        <TableHead className="w-16 text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {group.items.map((kra) => (
                                                        <TableRow key={kra.id}>
                                                            <TableCell className="font-medium">
                                                                KRA {kra.number}
                                                            </TableCell>

                                                            <TableCell>
                                                                {kra.title}
                                                            </TableCell>

                                                            <TableCell>
                                                                {kra.description ??
                                                                    '-'}
                                                            </TableCell>

                                                            <TableCell className="text-center">
                                                                {kra.order_no}
                                                            </TableCell>

                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        openEdit(
                                                                            kra,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    );
                })()}
            </div>
        </>
    );
}
