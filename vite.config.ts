import { defineConfig } from 'vite';
import { landing } from './site/src/templates';

export default defineConfig({
  root: 'site',
  publicDir: 'public',
  plugins: [{
    name: 'prerender-landing',
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', `<div id="app" data-prerendered-route="/">${landing()}</div>`);
    }
  }],
  build: {
    outDir: '../dist/site',
    emptyOutDir: true,
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
