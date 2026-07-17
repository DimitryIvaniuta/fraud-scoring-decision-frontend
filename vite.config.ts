import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL ?? 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    },
    preview: {
      port: 4173,
      strictPort: true
    },
    build: {
      sourcemap: false,
      target: 'es2024',
      chunkSizeWarningLimit: 500
    },
    define: {
      __API_BASE_URL__: JSON.stringify(apiBaseUrl)
    }
  };
});
