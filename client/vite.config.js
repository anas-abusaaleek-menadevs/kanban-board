import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api requests to the Express server during development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  // Vitest settings. globals: true makes describe, it, and expect available without imports.
  test: {
    globals: true,
    // jsdom simulates a browser environment so React components can render and query the DOM.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
});
