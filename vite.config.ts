import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/google-sheets': {
        target: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnf4Sm6V9ZWNHbHKDtC10sXRmxtdvO66SMFeIGIGE7SYeUgqbqeod010MNeGV0p3KIVcPOVmhBwpFI/pub?output=csv',
        changeOrigin: true,
        rewrite: (path) => ''
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
