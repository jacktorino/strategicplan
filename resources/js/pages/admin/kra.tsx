import { Head, router } from '@inertiajs/react';
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
    strategicPlan?: StrategicPlanSummary;
}

interface Props {
    kras: Kra[];
    strategicPlans: StrategicPlanSummary[];
    filters: {
        strategic_plan_id?: string;
    };
}

export default function Kra({ kras, strategicPlans, filters }: Props) {
    function handlePlanFilterChange(value: string) {
        router.get(
            '/kras',
            value === 'all' ? {} : { strategic_plan_id: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Key Result Areas" />

            <div className="container mx-8 py-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold">Key Result Areas</h1>

                    <div className="w-full md:w-64">
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
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Number</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Strategic Plan</TableHead>
                                <TableHead className="w-24 text-center">
                                    Order
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {kras.length > 0 ? (
                                kras.map((kra) => (
                                    <TableRow key={kra.id}>
                                        <TableCell className="font-medium">
                                            KRA {kra.number}
                                        </TableCell>

                                        <TableCell>{kra.title}</TableCell>

                                        <TableCell>
                                            {kra.description ?? '-'}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline">
                                                {kra.strategicPlan?.title ??
                                                    kra.strategic_plan_id}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-center">
                                            {kra.order_no}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        No KRAs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
