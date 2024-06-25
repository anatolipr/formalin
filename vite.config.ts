import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), cssInjectedByJsPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        main2: 'index2.html',
      },
      output: {
        
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',

        // assetFileNames: ({ name }) => {
        //   if (/\.(css)$/.test(name ?? '')) {
        //     return 'assets/css/[name]-app2.css';
        //   }
        //   return 'assets/[name]-[hash][extname]';
        // }

      }
    },
  },
})
