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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface KraSummary {
    id: number;
    number: string;
    title: string;
    strategic_plan_id: number;
    school_year: string | null;
}

function kraLabel(kra: KraSummary) {
    return kra.school_year
        ? `KRA ${kra.number} — ${kra.title} (${kra.school_year})`
        : `KRA ${kra.number} — ${kra.title}`;
}

interface SubKra {
    id: number;
    kra_id: number;
    code: string;
    title: string;
    description: string | null;
    order_no: number;
    kra?: KraSummary;
}

interface Props {
    subKras: SubKra[];
    kras: KraSummary[];
    strategicPlans: StrategicPlanSummary[];
    filters: {
        kra_id?: string;
        strategic_plan_id?: string;
    };
}

type SubKraFormData = {
    kra_id: string;
    code: string;
    title: string;
    description: string;
    order_no: number;
};

type GroupedByKra = {
    kra?: KraSummary;
    items: SubKra[];
};

type GroupedByPlan = {
    plan?: StrategicPlanSummary;
    kraGroups: Map<number, GroupedByKra>;
};

export default function SubKra({
    subKras,
    kras,
    strategicPlans,
    filters,
}: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingSubKra, setEditingSubKra] = useState<SubKra | null>(null);

    // ----- Table filters -----
    function updateFilters(next: Partial<Props['filters']>) {
        const merged = { ...filters, ...next };

        const params: Record<string, string> = {};
        if (merged.strategic_plan_id && merged.strategic_plan_id !== 'all') {
            params.strategic_plan_id = merged.strategic_plan_id;
        }
        if (merged.kra_id && merged.kra_id !== 'all') {
            params.kra_id = merged.kra_id;
        }

        router.get('/sub-kras', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function handlePlanFilterChange(value: string) {
        // Changing the academic year invalidates any KRA filter from a
        // different year, so clear it rather than leaving a stale/hidden filter.
        updateFilters({ strategic_plan_id: value, kra_id: 'all' });
    }

    function handleKraFilterChange(value: string) {
        updateFilters({ kra_id: value });
    }

    // KRA filter options are scoped to the currently selected academic year
    const krasForFilter = useMemo(() => {
        if (!filters.strategic_plan_id) return kras;

        return kras.filter(
            (kra) =>
                String(kra.strategic_plan_id) === filters.strategic_plan_id,
        );
    }, [kras, filters.strategic_plan_id]);

    // ----- Create form -----
    const createForm = useForm<SubKraFormData>({
        kra_id: '',
        code: '',
        title: '',
        description: '',
        order_no: 1,
    });

    // Sub-KRAs belonging to whichever KRA is currently selected in the create form
    const existingSubKrasForSelectedKra = useMemo(() => {
        if (!createForm.data.kra_id) return [];

        return subKras.filter(
            (subKra) => String(subKra.kra_id) === createForm.data.kra_id,
        );
    }, [createForm.data.kra_id, subKras]);

    const selectedKra = kras.find(
        (kra) => String(kra.id) === createForm.data.kra_id,
    );

    function handleCreateSubmit(e: FormEvent) {
        e.preventDefault();

        createForm.post('/sub-kras', {
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
    const editForm = useForm<SubKraFormData>({
        kra_id: '',
        code: '',
        title: '',
        description: '',
        order_no: 1,
    });

    function openEdit(subKra: SubKra) {
        setEditingSubKra(subKra);
        editForm.setData({
            kra_id: String(subKra.kra_id),
            code: subKra.code,
            title: subKra.title,
            description: subKra.description ?? '',
            order_no: subKra.order_no,
        });
        editForm.clearErrors();
    }

    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();
        if (!editingSubKra) return;

        editForm.put(`/sub-kras/${editingSubKra.id}`, {
            onSuccess: () => {
                setEditingSubKra(null);
                editForm.reset();
            },
        });
    }

    function handleEditSheetOpenChange(isOpen: boolean) {
        if (!isOpen) {
            setEditingSubKra(null);
            editForm.reset();
            editForm.clearErrors();
        }
    }

    return (
        <>
            <Head title="Sub-KRAs" />

            <div className="container mx-8 py-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold">Sub-KRAs</h1>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="w-full sm:w-56">
                            <Select
                                value={filters.strategic_plan_id ?? 'all'}
                                onValueChange={handlePlanFilterChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Academic Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Academic Years
                                    </SelectItem>
                                    {strategicPlans.map((plan) => (
                                        <SelectItem
                                            key={plan.id}
                                            value={String(plan.id)}
                                        >
                                            {plan.school_year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-64">
                            <Select
                                value={filters.kra_id ?? 'all'}
                                onValueChange={handleKraFilterChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by KRA" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All KRAs
                                    </SelectItem>
                                    {krasForFilter.map((kra) => (
                                        <SelectItem
                                            key={kra.id}
                                            value={String(kra.id)}
                                        >
                                            {kraLabel(kra)}
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
                                    New Sub-KRA
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-full overflow-y-auto p-10 sm:w-[60vw] sm:max-w-none"
                            >
                                <SheetHeader>
                                    <SheetTitle>New Sub-KRA</SheetTitle>
                                    <SheetDescription>
                                        Pick a KRA, then add a Sub-KRA to it.
                                    </SheetDescription>
                                </SheetHeader>

                                <form
                                    onSubmit={handleCreateSubmit}
                                    className="mt-8 space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="kra_id">KRA</Label>
                                        <Select
                                            value={createForm.data.kra_id}
                                            onValueChange={(value) =>
                                                createForm.setData(
                                                    'kra_id',
                                                    value,
                                                )
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
                                                        {kraLabel(kra)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.kra_id && (
                                            <p className="text-sm text-destructive">
                                                {createForm.errors.kra_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Existing sub-KRAs for the selected KRA */}
                                    {createForm.data.kra_id && (
                                        <div className="rounded-md border bg-muted/30 p-4">
                                            <p className="mb-2 text-sm font-medium">
                                                Existing Sub-KRAs for{' '}
                                                {selectedKra
                                                    ? kraLabel(selectedKra)
                                                    : ''}
                                            </p>

                                            {existingSubKrasForSelectedKra.length ===
                                            0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    No sub-KRAs yet for this
                                                    KRA.
                                                </p>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {existingSubKrasForSelectedKra.map(
                                                        (subKra) => (
                                                            <li
                                                                key={subKra.id}
                                                                className="flex items-center justify-between text-sm"
                                                            >
                                                                <span>
                                                                    {
                                                                        subKra.code
                                                                    }{' '}
                                                                    —{' '}
                                                                    {
                                                                        subKra.title
                                                                    }
                                                                </span>
                                                                <Badge variant="outline">
                                                                    Order{' '}
                                                                    {
                                                                        subKra.order_no
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
                                        <Label htmlFor="code">Code</Label>
                                        <Input
                                            id="code"
                                            placeholder="1.1"
                                            value={createForm.data.code}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    'code',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {createForm.errors.code && (
                                            <p className="text-sm text-destructive">
                                                {createForm.errors.code}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Governance"
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
                                            Save Sub-KRA
                                        </Button>
                                    </div>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Edit Sheet — controlled by editingSubKra, no visible trigger */}
                <Sheet
                    open={editingSubKra !== null}
                    onOpenChange={handleEditSheetOpenChange}
                >
                    <SheetContent
                        side="right"
                        className="w-full overflow-y-auto p-10 sm:w-[60vw] sm:max-w-none"
                    >
                        <SheetHeader>
                            <SheetTitle>Edit Sub-KRA</SheetTitle>
                            <SheetDescription>
                                Update the details of this Sub-KRA.
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            onSubmit={handleEditSubmit}
                            className="mt-8 space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="edit-kra_id">KRA</Label>
                                <Select
                                    value={editForm.data.kra_id}
                                    onValueChange={(value) =>
                                        editForm.setData('kra_id', value)
                                    }
                                >
                                    <SelectTrigger id="edit-kra_id">
                                        <SelectValue placeholder="Select a KRA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kras.map((kra) => (
                                            <SelectItem
                                                key={kra.id}
                                                value={String(kra.id)}
                                            >
                                                {kraLabel(kra)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.kra_id && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.kra_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-code">Code</Label>
                                <Input
                                    id="edit-code"
                                    value={editForm.data.code}
                                    onChange={(e) =>
                                        editForm.setData('code', e.target.value)
                                    }
                                />
                                {editForm.errors.code && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.code}
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
                                    onClick={() => setEditingSubKra(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Update Sub-KRA
                                </Button>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>

                {(() => {
                    // Two-level grouping: Academic Year (Strategic Plan) → KRA.
                    // Grouping only by KRA number was confusing, since the same
                    // KRA number repeats once per academic year.
                    const groupedByPlan = new Map<number, GroupedByPlan>();

                    subKras.forEach((subKra) => {
                        const planId = subKra.kra?.strategic_plan_id ?? 0;

                        if (!groupedByPlan.has(planId)) {
                            groupedByPlan.set(planId, {
                                plan: strategicPlans.find(
                                    (p) => p.id === planId,
                                ),
                                kraGroups: new Map(),
                            });
                        }

                        const planGroup = groupedByPlan.get(planId)!;

                        if (!planGroup.kraGroups.has(subKra.kra_id)) {
                            planGroup.kraGroups.set(subKra.kra_id, {
                                kra: subKra.kra,
                                items: [],
                            });
                        }

                        planGroup.kraGroups
                            .get(subKra.kra_id)!
                            .items.push(subKra);
                    });

                    if (subKras.length === 0) {
                        return (
                            <Card>
                                <CardContent className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                                    No Sub-KRAs found.
                                </CardContent>
                            </Card>
                        );
                    }

                    return (
                        <div className="space-y-8">
                            {Array.from(groupedByPlan.entries()).map(
                                ([planId, planGroup]) => (
                                    <Card key={planId}>
                                        <CardHeader>
                                            <CardTitle>
                                                {planGroup.plan
                                                    ? `${planGroup.plan.school_year} — ${planGroup.plan.title}`
                                                    : 'Unknown Academic Year'}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-6 p-0">
                                            <div className="divide-y">
                                                {Array.from(
                                                    planGroup.kraGroups.entries(),
                                                ).map(([kraId, kraGroup]) => (
                                                    <div
                                                        key={kraId}
                                                        className="p-6"
                                                    >
                                                        <h3 className="mb-3 font-semibold">
                                                            KRA{' '}
                                                            {
                                                                kraGroup.kra
                                                                    ?.number
                                                            }
                                                            {kraGroup.kra
                                                                ?.title && (
                                                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                                    (
                                                                    {
                                                                        kraGroup
                                                                            .kra
                                                                            .title
                                                                    }
                                                                    )
                                                                </span>
                                                            )}
                                                        </h3>

                                                        <div className="rounded-md border">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-24">
                                                                            Code
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
                                                                    {kraGroup.items.map(
                                                                        (
                                                                            subKra,
                                                                        ) => (
                                                                            <TableRow
                                                                                key={
                                                                                    subKra.id
                                                                                }
                                                                            >
                                                                                <TableCell className="font-medium">
                                                                                    {
                                                                                        subKra.code
                                                                                    }
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    {
                                                                                        subKra.title
                                                                                    }
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    {subKra.description ??
                                                                                        '-'}
                                                                                </TableCell>

                                                                                <TableCell className="text-center">
                                                                                    {
                                                                                        subKra.order_no
                                                                                    }
                                                                                </TableCell>

                                                                                <TableCell className="text-right">
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="icon"
                                                                                        onClick={() =>
                                                                                            openEdit(
                                                                                                subKra,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Pencil className="h-4 w-4" />
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ),
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ),
                            )}
                        </div>
                    );
                })()}
            </div>
        </>
    );
}
