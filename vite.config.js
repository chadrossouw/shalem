import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { viteAwesomeSvgLoader } from "vite-awesome-svg-loader";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.scss', 'resources/js/app.js'],
            refresh: true,
        }),
        viteAwesomeSvgLoader(),
    ],
});
