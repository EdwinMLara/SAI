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
         // Intern paths
         '@': resolve(__dirname, './src'),
         '@components': resolve(__dirname, './src/components'),
         '@ui': resolve(__dirname, './src/components/ui'),
         '@services': resolve(__dirname, './src/core/services'),
         '@interfaces': resolve(__dirname, './src/core/interfaces'),
         '@config': resolve(__dirname, './src/core/config'),
         '@utils': resolve(__dirname, './src/utils'),
         '@pages': resolve(__dirname, './src/pages'),
         '@hooks': resolve(__dirname, './src/hooks'),
         '@context': resolve(__dirname, './src/context'),
         '@layouts': resolve(__dirname, './src/layouts'),
         '@routes': resolve(__dirname, './src/routes'),

         // Common paths
         '@cmm': resolve(__dirname, '../common'),
         '@cmm_interfaces': resolve(__dirname, '../common/interfaces/*'),
      },
   },
   server: {
      proxy: {
         '/api': {
            target: `http://${process.env.VITE_API_HOST || 'localhost'}:${process.env.VITE_API_PORT || '5001'}`,
            changeOrigin: true,
            secure: false,
         },
      },
   },
});
