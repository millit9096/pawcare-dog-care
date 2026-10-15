import { defineConfig } from 'vite';

export default defineConfig({
  root: 'site',
  base: './',
  build: {
    outDir: '../www',
    emptyOutDir: true,
    sourcemap: false
  }
});

