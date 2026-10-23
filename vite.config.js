import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built index.html loads its assets through the app:// protocol.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
});
