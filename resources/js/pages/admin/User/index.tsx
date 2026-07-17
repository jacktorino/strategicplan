import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    VisibilityState,
    HeaderContext,
    CellContext,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronDown, Pencil, Plus, LoaderCircle } from 'lucide-react';
import { Head, useForm } from '@inertiajs/react';

// Matches the `sub_kras` table: id, kra_id, code, title, order_no
interface SubKra {
    id: number;
    code: string;
    title: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    // Matches the enum defined on the `users` migration
    role: 'admin' | 'strategic_planner' | 'key_result_area' | 'viewer';
    sub_kra: { code: string; title: string } | null;
}

const ROLE_OPTIONS: { value: User['role']; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'strategic_planner', label: 'Strategic Planner' },
    { value: 'key_result_area', label: 'Key Result Area' },
    { value: 'viewer', label: 'Viewer' },
];

export default function Index({
    users,
    subKras = [],
}: {
    users: User[];
    // Pass this from your controller, e.g. SubKra::select('id', 'code', 'title')->get()
    subKras?: SubKra[];
}) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'viewer' as User['role'],
            sub_kra_id: '' as string | number,
        });

    // Only the key_result_area role is actually tied to a sub-KRA
    const needsSubKra = data.role === 'key_result_area';

    const columnHelper = createColumnHelper<User>();

    const columns = [
        {
            id: 'select',
            header: ({ table }: HeaderContext<User, unknown>) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }: CellContext<User, unknown>) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        columnHelper.accessor('name', { header: 'Name' }),
        columnHelper.accessor('email', { header: 'Email' }),
        columnHelper.accessor('role', {
            header: 'Role',
            cell: (info) => (
                <span className="capitalize">
                    {(info.getValue() as string).replace('_', ' ')}
                </span>
            ),
        }),
        columnHelper.accessor('sub_kra', {
            header: 'Assigned Sub-KRA',
            cell: (info) => {
                const subKra = info.getValue();
                return subKra
                    ? `${subKra.code} — ${subKra.title}`
                    : 'Unassigned';
            },
        }),
        {
            id: 'actions',
            header: 'Actions',
            cell: () => (
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: users ?? [],
        columns,
        state: { columnVisibility, rowSelection },
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleRoleChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            role: value as User['role'],
            sub_kra_id: value === 'key_result_area' ? prev.sub_kra_id : '',
        }));
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        setIsCreateOpen(open);
        if (!open) {
            reset();
            clearErrors();
        }
    };

    return (
        <>
            <Head title="Users" />
            <div className="w-full p-6">
                <div className="flex items-center gap-2 py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={
                            (table
                                .getColumn('email')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(e) =>
                            table
                                .getColumn('email')
                                ?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />

                    {/* Group the Create button and Column dropdown together on the right */}
                    <div className="ml-auto flex items-center gap-2">
                        <Dialog
                            open={isCreateOpen}
                            onOpenChange={handleOpenChange}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Create
                                    Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create account</DialogTitle>
                                    <DialogDescription>
                                        Add a new user without leaving this
                                        page.
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={handleCreateSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            autoFocus
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={handleRoleChange}
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ROLE_OPTIONS.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.role && (
                                            <p className="text-sm text-destructive">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    {needsSubKra && (
                                        <div className="space-y-2">
                                            <Label htmlFor="sub_kra_id">
                                                Sub-KRA
                                            </Label>
                                            <Select
                                                value={
                                                    data.sub_kra_id
                                                        ? String(
                                                              data.sub_kra_id,
                                                          )
                                                        : ''
                                                }
                                                onValueChange={(value) =>
                                                    setData('sub_kra_id', value)
                                                }
                                            >
                                                <SelectTrigger id="sub_kra_id">
                                                    <SelectValue placeholder="Select a sub-KRA" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subKras.map((subKra) => (
                                                        <SelectItem
                                                            key={subKra.id}
                                                            value={String(
                                                                subKra.id,
                                                            )}
                                                        >
                                                            {subKra.code} —{' '}
                                                            {subKra.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.sub_kra_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.sub_kra_id}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenChange(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Create account
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Columns{' '}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((col) => col.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(val) =>
                                                column.toggleVisibility(!!val)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
