import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type User = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    id?: string;
    users: User[];
    value: string; // '' means unselected
    onChange: (value: string) => void;
    placeholder?: string;
    emptyOptionLabel?: string; // e.g. "No champion assigned" — omit to make selection required
    disabled?: boolean;
};

export function UserCombobox({
    id,
    users,
    value,
    onChange,
    placeholder = 'Select a user',
    emptyOptionLabel,
    disabled,
}: Props) {
    const [open, setOpen] = useState(false);

    const selectedUser = users.find((user) => String(user.id) === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">
                        {selectedUser
                            ? `${selectedUser.name} — ${selectedUser.email}`
                            : value === '' && emptyOptionLabel
                              ? emptyOptionLabel
                              : placeholder}
                    </span>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Search by name or email..." />

                    <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>

                        <CommandGroup>
                            {emptyOptionLabel && (
                                <CommandItem
                                    value={`__none__ ${emptyOptionLabel}`}
                                    onSelect={() => {
                                        onChange('');
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === ''
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {emptyOptionLabel}
                                </CommandItem>
                            )}

                            {users.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={`${user.name} ${user.email}`}
                                    onSelect={() => {
                                        onChange(String(user.id));
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === String(user.id)
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    <span className="truncate">
                                        {user.name} — {user.email}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
