import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import * as dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
    const env = dotenv.config().parsed;

    return {
        build: {
            outDir: '../user-client/public'
        },
        plugins: [
            svelte({
                preprocess: sveltePreprocess(),
            }),
        ],
        resolve: {
        alias: {
            src:  '/src',
            assets: '/src/assets',
            components: '/src/components',
            utils: '/src/utils',
            pages: '/src/pages',
            stores: '/src/stores',
            interfases: '/src/interfases',
            constants: '/src/constants',
            services: '/src/services',
            styles: '/src/styles',
            models: '/src/models',
        }
        },
        base: '/',
        mode,
        define: {
        'process.env': env,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler' // or "modern"
                }
            }
        },
        // server: {
        //     proxy: {
        //         '/api': {
        //             target: process.env.URL,
        //             changeOrigin: true,
        //             secure: false,
        //         },
        //     },
        // }
    }
})