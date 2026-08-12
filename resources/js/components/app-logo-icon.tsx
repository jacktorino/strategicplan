import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // standard shadcn / tailwind helper

export default function AppLogoIcon({
    className,
    alt = 'Logo',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/UVLOGO.svg"
            alt={alt}
            {...props}
            className={cn('h-10 w-10 object-contain', className)}
        />
    );
}
