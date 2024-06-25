import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { sveltePreprocess } from 'svelte-preprocess';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        main2: 'index2.html',
      },
      output: {

        //define custom output for JS so the URL to include them is always the same
        // format: 'es',
        // dir: 'dist',
        // entryFileNames: 'assets/js/[name]-app2.js',
        // chunkFileNames: 'assets/js/[name]-app2-[hash].js',
        // assetFileNames: 'assets/[name]-[hash][extname]'
        

        manualChunks(id) {
          if (id.includes('index.html')) {
            return 'main';
          } else if (id.includes('index2.html')) {
            return 'main2';
          }
        },
        
        entryFileNames: '[name].js',
        // chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',

        //define custom output for CSS so the URL to include them is always the same



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
