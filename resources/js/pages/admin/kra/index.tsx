import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface KraRow {
    id: number;
    number: string;
    title: string;
    description: string | null;
    order_no: number;
    sub_kras_count: number;
}

interface Props {
    kras: KraRow[];
}

export default function KraIndex({ kras }: Props) {
    function handleDelete(kra: KraRow) {
        if (kra.sub_kras_count > 0) {
            if (
                !confirm(
                    `"${kra.title}" has ${kra.sub_kras_count} Sub KRA(s) attached, which will be deleted too. Continue?`,
                )
            ) {
                return;
            }
        } else if (!confirm(`Delete KRA "${kra.title}"?`)) {
            return;
        }

        router.delete(`/kra/${kra.id}`);
    }

    return (
        <>
            <Head title="Key Results Areas" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Key Results Areas
                        </h1>
                        <p className="text-muted-foreground">
                            Manage the KRA framework shared across strategic
                            plans.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/kra/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add KRA
                        </Link>
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">#</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Sub KRAs</TableHead>
                                <TableHead className="w-32 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kras.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No KRAs yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kras.map((kra) => (
                                    <TableRow key={kra.id}>
                                        <TableCell className="font-medium">
                                            {kra.number}
                                        </TableCell>
                                        <TableCell>
                                            <div>{kra.title}</div>
                                            {kra.description && (
                                                <div className="text-sm text-muted-foreground">
                                                    {kra.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/subkra?kra_id=${kra.id}`}
                                            >
                                                <Badge variant="outline">
                                                    {kra.sub_kras_count} Sub KRA
                                                    {kra.sub_kras_count === 1
                                                        ? ''
                                                        : 's'}
                                                </Badge>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={`/kra/${kra.id}/edit`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(kra)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
