import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@services': resolve(__dirname, './src/core/services'),
      '@interfaces': resolve(__dirname, './src/core/interfaces'),
      '@common': resolve(__dirname, './src/core/common'),
      '@utils': resolve(__dirname, './src/utils'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@routes': resolve(__dirname, './src/routes'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
