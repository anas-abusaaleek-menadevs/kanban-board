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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
});
