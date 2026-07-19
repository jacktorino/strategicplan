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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';

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

Index.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: '/Index',
        },
    ],
};

export default function Index({
    users,
}: {
    users: User[];
    subKras?: SubKra[];
}) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});

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
            header: 'Key Result Area',
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
            cell: ({ row }: CellContext<User, unknown>) => {
                const user = row.original;

                return (
                    <div className="flex items-center gap-2">
                        {/* View */}
                        <Button variant="default" size="icon" asChild>
                            <Link href={`/users/${user.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>

                        {/* Edit */}
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/users/${user.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>

                        {/* Delete */}
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                                if (
                                    confirm(
                                        `Delete ${user.name}? This action cannot be undone.`,
                                    )
                                ) {
                                    router.delete(`/users/${user.id}`, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            console.log(
                                                'User deleted successfully.',
                                            );
                                        },
                                        onError: (errors) => {
                                            console.error(errors);
                                        },
                                    });
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
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
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="mr-2 h-4 w-4" /> Create Account
                            </Link>
                        </Button>

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
                </div>
            </div>
        </>
    );
}
