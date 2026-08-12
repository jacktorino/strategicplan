import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            {/* Top Background Panel with Responsive Curve */}
            <div className="absolute inset-x-0 top-0 h-[420px] bg-green-700 [clip-path:ellipse(120%_100%_at_50%_0%)]" />
            {/* Main Content Container */}
            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex flex-col items-center justify-center gap-3 self-center font-medium transition-transform hover:scale-105"
                >
                    <AppLogoIcon className="size-20 drop-shadow-lg filter transition-all" />

                    <h1 className="text-3xl font-bold tracking-tight text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.35)]">
                        Strategic Plan
                    </h1>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl shadow-lg">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
