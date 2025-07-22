import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/google-sheets': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-sheets/, ''),
        secure: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
