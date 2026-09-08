import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite bundler configuration for a React 18 single-page application.
// `base: './'` keeps asset URLs relative so the production build can be dropped
// into any sub-directory of a static host without rewriting paths.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
