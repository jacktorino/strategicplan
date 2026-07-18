import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

interface ProgressEntry {
    id: number;
    kpi_id: number;
    percentage: number;
    month: number;
    year: number;
    remarks: string | null;
}

interface Props {
    kpiId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry?: ProgressEntry | null;
}

export default function ProgressDialog({
    kpiId,
    open,
    onOpenChange,
    entry,
}: Props) {
    const isEditing = !!entry;
    const now = new Date();

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            kpi_id: kpiId,
            percentage: 0,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            remarks: '',
        });

    useEffect(() => {
        if (open) {
            clearErrors();
            setData({
                kpi_id: kpiId,
                percentage: entry?.percentage ?? 0,
                month: entry?.month ?? now.getMonth() + 1,
                year: entry?.year ?? now.getFullYear(),
                remarks: entry?.remarks ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, entry]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        };

        if (isEditing && entry) {
            put(`/progress/${entry.id}`, options);
        } else {
            post('/progress', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Progress Entry' : 'Record Progress'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pg-month">Month</Label>
                            <Select
                                value={String(data.month)}
                                onValueChange={(value) =>
                                    setData('month', Number(value))
                                }
                            >
                                <SelectTrigger id="pg-month">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((label, i) => (
                                        <SelectItem
                                            key={label}
                                            value={String(i + 1)}
                                        >
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.month && (
                                <p className="text-sm text-destructive">
                                    {errors.month}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pg-year">Year</Label>
                            <Input
                                id="pg-year"
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData('year', Number(e.target.value))
                                }
                            />
                            {errors.year && (
                                <p className="text-sm text-destructive">
                                    {errors.year}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pg-percentage">Progress (%)</Label>
                        <Input
                            id="pg-percentage"
                            type="number"
                            min={0}
                            max={100}
                            step="0.01"
                            value={data.percentage}
                            onChange={(e) =>
                                setData('percentage', Number(e.target.value))
                            }
                        />
                        {errors.percentage && (
                            <p className="text-sm text-destructive">
                                {errors.percentage}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pg-remarks">Remarks</Label>
                        <Textarea
                            id="pg-remarks"
                            rows={2}
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                    </div>
                    {errors.kpi_id && (
                        <p className="text-sm text-destructive">
                            {errors.kpi_id}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {isEditing ? 'Save changes' : 'Add entry'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
