/**
 * ============================================================================
 * axios.config.ts — Configuración global de Axios (cliente HTTP del frontend)
 * ============================================================================
 *
 * CAMBIO REALIZADO:
 *
 * Se aumentó el timeout de Axios de 10,000ms (10 segundos) a 300,000ms
 * (5 minutos).
 *
 * CONTEXTO:
 * Axios es la librería que el frontend usa para hacer peticiones HTTP al
 * backend. Cada petición que Axios hace tiene un "timeout": el tiempo máximo
 * que esperará antes de que se considere como fallida.
 *
 * ANTES: El timeout era de 10 segundos (10,000ms). Esto es suficiente para
 * peticiones normales (login, buscar un producto, etc.), pero NO para
 * operaciones pesadas.
 *
 * PROBLEMA: Cuando se subían ~15,000 productos, la petición POST a
 * /api/products/replaceAll tardaba más de 10 segundos (el backend estaba
 * insertando 15,000 documentos en MongoDB). Axios cortaba la conexión
 * después de 10 segundos y mostraba un error de timeout, aunque el backend
 * seguía procesando.
 *
 * SOLUCIÓN: Se aumentó el timeout a 5 minutos (300,000ms) para que Axios
 * espere suficiente tiempo a que el backend complete operaciones pesadas.
 *
 * NOTA: Este cambio, junto con el timeout del proxy en vite.config.ts,
 * asegura que la cadena completa (navegador → proxy de Vite → backend →
 * MongoDB) tenga suficiente tiempo para procesar la subida masiva de datos.
 *
 * CONCEPTOS:
 * - Axios: Librería de JavaScript para hacer peticiones HTTP (GET, POST,
 *   PUT, DELETE, etc.). Simplifica el trabajo con APIs REST.
 * - Timeout: Tiempo máximo de espera para una respuesta. Si el servidor no
 *   responde antes de este tiempo, Axios lanza un error de timeout.
 * - withCredentials: Cuando es true, Axios envía las cookies con cada
 *   petición. Esto es necesario para que el sistema de autenticación funcione
 *   (el JWT access token y refresh token se almacenan en cookies).
 * - Interceptor: Una función que se ejecuta ANTES o DESPUÉS de cada petición.
 *   Se usa aquí para manejar automáticamente la renovación de tokens: si el
 *   backend responde con 401 (token expirado) y indica que se puede refrescar,
 *   Axios automáticamente intenta obtener un nuevo token y reintentar la
 *   petición original sin que el usuario lo note.
 * ============================================================================
 */

import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import { ApiResponse } from '@interfaces/Api.interfaces';

import env from '../common/env';

// baseURL: Todas las peticiones se harán relativas a /api.
// Por ejemplo, axios.get('/products') realmente llama a /api/products.
// En desarrollo, Vite redirige /api/* al backend en localhost:3000.
axios.defaults.baseURL = '/api';

// withCredentials: true indica que Axios debe enviar y recibir cookies
// con cada petición. Esto es esencial para la autenticación basada en cookies
// (access token + refresh token que el backend guarda en cookies HTTPOnly).
axios.defaults.withCredentials = true;

// timeout: Tiempo máximo en milisegundos que Axios esperará la respuesta.
// Se subió de 10,000ms (10s) a 300,000ms (5 min) para soportar operaciones
// pesadas como la subida de ~15,000 productos a MongoDB Atlas.
axios.defaults.timeout = 300000;

// --- Sistema de refresh automático de tokens ---
// Cuando el access token expira pero el refresh token sigue válido, el backend
// responde con un 401 y { refresh: true, access: false }. El interceptor
// detecta esto, llama a /auth/refresh para obtener un nuevo token, y reintenta
// la petición original. Todo esto ocurre automáticamente sin que el usuario
// lo note.

let isRefreshing = false;
let refreshSubscribers: Array<(token?: string) => void> = [];

const addRefreshSubscriber = (callback: (token?: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token?: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const resData = response.data;
    log(resData);

    // El ResponseMiddleware del backend envuelve toda respuesta en { status, data }.
    // Este interceptor reforma la respuesta para que el frontend la reciba de
    // forma más limpia: { status, message, all }.
    return {
      ...response,
      data: {
        status: resData.status || response.status,
        message:
          resData.message || (resData.data && resData.data.message) || '',
        all: resData.data || resData,
      },
    };
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si el backend responde 401 y no hemos intentado refrescar ya:
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = error.response.data as any;

      // refresh: true + access: false = "Tu access token expiró, pero el
      // refresh token sigue válido. Puedes pedir un nuevo access token."
      if (errorData.refresh === true && errorData.access === false) {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            const refreshResponse = await axios.get('/auth/refresh');
            if (refreshResponse.status === 200) {
              isRefreshing = false;
              onRefreshed();
              // Reintentar la petición original con el nuevo token
              return axios(originalRequest);
            }
          } catch (refreshError) {
            isRefreshing = false;
            onRefreshed();
            // Si el refresh falla, el token expiró completamente → cerrar sesión
            window.dispatchEvent(new CustomEvent('auth:logout'));
            return Promise.reject(refreshError);
          }
        } else {
          // Si ya se está refrescando, esperar a que termine y reintentar
          return new Promise((resolve) => {
            addRefreshSubscriber(() => {
              resolve(axios(originalRequest));
            });
          });
        }
      }
    }

    if (error.response?.data) {
      const errorData = error.response.data as any;
      log(errorData);
      return Promise.resolve({
        ...error.response,
        data: {
          status: errorData.status || error.response.status,
          message:
            (errorData.data && errorData.data.message) ||
            errorData.message ||
            'Error desconocido',
          all: errorData.data || errorData,
        },
      });
    }

    return Promise.resolve({
      ...error.response,
      data: {
        status: 500,
        message: 'Error de conexión con el servidor',
        all: null,
      },
    });
  }
);

const log = (response: unknown) => {
  if (env.NODE_ENV === 'development') {
    console.log(response);
  }
};

export default axios;
