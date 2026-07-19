import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { bunny } from 'laravel-vite-plugin/fonts';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import inertia from '@inertiajs/vite';
import path from 'path'; // <--- Import path

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'), // <--- Add this
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
