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
         '@cmm_interfaces': resolve(__dirname, '../common/interfaces/*'),
         '@ui': resolve(__dirname, './src/components/ui'),
         '@services': resolve(__dirname, './src/core/services'),
         '@interfaces': resolve(__dirname, './src/core/interfaces'),
         '@common': resolve(__dirname, '../common'),
         '@managment': resolve(__dirname, './src/core/managment'),
         '@config': resolve(__dirname, './src/core/config'),
         '@utils': resolve(__dirname, './src/utils'),
         '@pages': resolve(__dirname, './src/pages'),
         '@hooks': resolve(__dirname, './src/hooks'),
         '@context': resolve(__dirname, './src/context'),
         '@layouts': resolve(__dirname, './src/layouts'),
         '@routes': resolve(__dirname, './src/routes'),
      },
   },
   server: {
      proxy: {
         '/api': {
            target: `http://${process.env.VITE_API_HOST}:${process.env.VITE_API_PORT}`,
            changeOrigin: true,
         },
      },
   },
});
