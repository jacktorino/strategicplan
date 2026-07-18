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
import { Textarea } from '@/components/ui/textarea';

interface ActionPlan {
    id: number;
    kpi_id: number;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    expected_output: string | null;
}

interface Props {
    kpiId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actionPlan?: ActionPlan | null;
}

export default function ActionPlanDialog({
    kpiId,
    open,
    onOpenChange,
    actionPlan,
}: Props) {
    const isEditing = !!actionPlan;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            kpi_id: kpiId,
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            expected_output: '',
        });

    useEffect(() => {
        if (open) {
            clearErrors();
            setData({
                kpi_id: kpiId,
                title: actionPlan?.title ?? '',
                description: actionPlan?.description ?? '',
                start_date: actionPlan?.start_date ?? '',
                end_date: actionPlan?.end_date ?? '',
                expected_output: actionPlan?.expected_output ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, actionPlan]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        };

        if (isEditing && actionPlan) {
            put(`/action-plans/${actionPlan.id}`, options);
        } else {
            post('/action-plans', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit Action Plan'
                            : 'Add Innovative Action Plan'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ap-title">Title</Label>
                        <Input
                            id="ap-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ap-description">Description</Label>
                        <Textarea
                            id="ap-description"
                            rows={2}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ap-start">Start date</Label>
                            <Input
                                id="ap-start"
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                            {errors.start_date && (
                                <p className="text-sm text-destructive">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ap-end">End date</Label>
                            <Input
                                id="ap-end"
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                            {errors.end_date && (
                                <p className="text-sm text-destructive">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ap-output">Expected output</Label>
                        <Textarea
                            id="ap-output"
                            rows={2}
                            value={data.expected_output}
                            onChange={(e) =>
                                setData('expected_output', e.target.value)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {isEditing ? 'Save changes' : 'Add plan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
