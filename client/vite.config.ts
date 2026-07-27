/**
 * ============================================================================
 * vite.config.ts — Configuración del servidor de desarrollo de Vite (frontend)
 * ============================================================================
 *
 * CAMBIO REALIZADO:
 *
 * Se agregó la propiedad "timeout: 300000" (300,000 milisegundos = 5 minutos)
 * al proxy de Vite.
 *
 * CONTEXTO:
 * Vite tiene un "proxy inverso" configurado. Esto significa que cuando el
 * frontend (corriendo en localhost:5173) hace una petición a /api/products,
 * Vite reenvía esa petición al backend (corriendo en localhost:3000).
 *
 * ANTES: El proxy usaba el timeout por defecto de Vite/Connect, que es de
 * aproximadamente 120,000ms (2 minutos).
 *
 * PROBLEMA: Cuando se subían ~15,000 productos, la operación de inserción
 * en MongoDB Atlas tomaba más de 2 minutos. El proxy cortaba la conexión
 * antes de que el backend terminara de procesar, resultando en un error 500
 * en el frontend aunque el backend seguía trabajando.
 *
 * SOLUCIÓN: Se aumentó el timeout a 5 minutos (300,000ms) para dar suficiente
 * tiempo a operaciones pesadas como la subida masiva de productos.
 *
 * CONCEPTOS:
 * - Proxy inverso: Un servidor intermedio que recibe peticiones de un cliente
 *   y las reenvía a otro servidor. En desarrollo, Vite actúa como proxy para
 *   que el frontend pueda hacer peticiones al backend sin problemas de CORS.
 * - changeOrigin: Opción del proxy que cambia el "Host" header de la petición
 *   para que el servidor de destino (backend) la reciba como si viniera
 *   directamente de él, no del proxy.
 * - Timeout: Tiempo máximo que el servidor esperará antes de cortar la conexión.
 * ============================================================================
 */

import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@ui': resolve(__dirname, './src/components/ui'),
      '@services': resolve(__dirname, './src/core/services'),
      '@interfaces': resolve(__dirname, './src/core/interfaces'),
      '@common': resolve(__dirname, './src/core/common'),
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
        // timeout: Tiempo máximo en ms que el proxy esperará la respuesta
        // del backend antes de cortar la conexión. Se subió de ~120s (default)
        // a 300s (5 min) para soportar operaciones pesadas como la subida
        // masiva de ~15,000 productos a MongoDB Atlas.
        timeout: 300000,
      },
    },
  },
});
