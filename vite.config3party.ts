import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { sveltePreprocess } from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({

    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
        }),
        cssInjectedByJsPlugin({ relativeCSSInjection: true })
    ],
    base: '',
    define: {
        "process.env": { "NODE_ENV": JSON.stringify("production") }
    },
    build: {
        sourcemap: true,
        outDir: 'dist',
        emptyOutDir: false,
        
        cssCodeSplit: true,

        lib: {
            entry: 'src/3party/3party.ts',
            fileName: (format: string) => `3party.js`,
            formats: ['es'],
        },

        rollupOptions: {
            output: {
                amd: { define: "false" },
            }
        }
        

    },
    


})
