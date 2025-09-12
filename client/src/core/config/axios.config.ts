import axios, {
   AxiosResponse,
   AxiosError,
   InternalAxiosRequestConfig,
} from 'axios';

import { StandardResponse } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

/**
 * Axios base instance configured with:
 * - API base URL from environment variables
 * - 10s timeout to prevent hanging requests
 * - Credentials included for cookie/session authentication
 * - Default headers for JSON content
 */
const axiosInstance = axios.create({
   baseURL: '/api',
   timeout: 10000,
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json',
   },
});

/**
 * Converts a successful Axios response to StandardResponse format.
 * Extracts: status, success, message, and data from backend.
 *
 * @template T - Expected data type in response.data
 * @param response - Axios response with backend structure
 * @returns StandardResponse typed with backend data
 */
const toStandardResponse = <T = any>(
   response: AxiosResponse
): StandardResponse<T> => {
   const standardResponse = {
      status: response.status,
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
   } as StandardResponse<T>;

   console.log('✅ StandardResponse:', {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      response: standardResponse,
   });

   return standardResponse;
};

/**
 * Converts Axios errors to unified StandardResponse format.
 * Handles:
 * 1. Server errors (4xx, 5xx) - with backend response
 * 2. Network/timeout errors - no server response
 * 3. Config/setup errors
 *
 * @template T - Expected data type in case of error
 * @param error - Full Axios error
 * @returns StandardResponse with normalized error info
 */
const errorToStandardResponse = <T = any>(
   error: AxiosError
): StandardResponse<T> => {
   let standardResponse: StandardResponse<T>;

   // Error with server response (4xx, 5xx)
   if (error.response && error.response.data) {
      const data = error.response.data;

      // If backend already returns StandardResponse
      if (
         data &&
         typeof data === 'object' &&
         'status' in data &&
         'success' in data &&
         'message' in data &&
         'data' in data
      ) {
         standardResponse = data as StandardResponse<T>;
      } else {
         // Create StandardResponse from non-standard backend response
         standardResponse = {
            status: error.response.status,
            success: error.response.status < 400,
            message: 'Ocurrió un error inesperado',
            data: data as T,
         } as StandardResponse<T>;
      }
   }
   // Network, timeout, or server unavailable error
   else if (error.request) {
      standardResponse = {
         status: 0,
         success: false,
         message: 'Error de comunicación. Intente más tarde',
         data: null,
      } as StandardResponse<T>;
   }
   // Config or unknown error
   else {
      standardResponse = {
         status: 500,
         success: false,
         message: 'Ocurrió un error inesperado. Vuelva a intentar',
         data: null,
      } as StandardResponse<T>;
   }

   console.log('❌ StandardResponse Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      error: error.message,
      response: standardResponse,
   });

   return standardResponse;
};

/**
 * Main API client that guarantees consistent responses.
 * All methods return StandardResponse, whether the request succeeded or failed.
 * This simplifies error handling by having a unified format.
 *
 * Methods: GET, POST, PUT, PATCH, DELETE
 * All include generic typing for expected data.
 */
export const apiClient = {
   /**
    * Performs a GET request to the specified endpoint
    * @template T - Expected data type in the response
    * @param url - Endpoint relative to baseURL
    * @param config - Additional Axios config (headers, params, etc.)
    * @returns Promise<StandardResponse<T>> - Normalized response
    */
   get: async <T = any>(
      url: string,
      config?: any
   ): Promise<StandardResponse<T>> => {
      try {
         const response = await axiosInstance.get(url, config);
         return toStandardResponse<T>(response);
      } catch (error) {
         return errorToStandardResponse<T>(error as AxiosError);
      }
   },

   /**
    * Performs a POST request to the specified endpoint
    * @template T - Expected data type in the response
    * @param url - Endpoint relative to baseURL
    * @param data - Data to send in the request body
    * @param config - Additional Axios config
    * @returns Promise<StandardResponse<T>> - Normalized response
    */
   post: async <T = any>(
      url: string,
      data?: any,
      config?: any
   ): Promise<StandardResponse<T>> => {
      try {
         const response = await axiosInstance.post(url, data, config);
         return toStandardResponse<T>(response);
      } catch (error) {
         return errorToStandardResponse<T>(error as AxiosError);
      }
   },

   /**
    * Performs a PUT request to the specified endpoint
    * @template T - Expected data type in the response
    * @param url - Endpoint relative to baseURL
    * @param data - Data to send in the request body
    * @param config - Additional Axios config
    * @returns Promise<StandardResponse<T>> - Normalized response
    */
   put: async <T = any>(
      url: string,
      data?: any,
      config?: any
   ): Promise<StandardResponse<T>> => {
      try {
         const response = await axiosInstance.put(url, data, config);
         return toStandardResponse<T>(response);
      } catch (error) {
         return errorToStandardResponse<T>(error as AxiosError);
      }
   },

   /**
    * Performs a PATCH request to the specified endpoint
    * @template T - Expected data type in the response
    * @param url - Endpoint relative to baseURL
    * @param data - Data to send in the request body
    * @param config - Additional Axios config
    * @returns Promise<StandardResponse<T>> - Normalized response
    */
   patch: async <T = any>(
      url: string,
      data?: any,
      config?: any
   ): Promise<StandardResponse<T>> => {
      try {
         const response = await axiosInstance.patch(url, data, config);
         return toStandardResponse<T>(response);
      } catch (error) {
         return errorToStandardResponse<T>(error as AxiosError);
      }
   },

   /**
    * Performs a DELETE request to the specified endpoint
    * @template T - Expected data type in the response
    * @param url - Endpoint relative to baseURL
    * @param config - Additional Axios config
    * @returns Promise<StandardResponse<T>> - Normalized response
    */
   delete: async <T = any>(
      url: string,
      config?: any
   ): Promise<StandardResponse<T>> => {
      try {
         const response = await axiosInstance.delete(url, config);
         return toStandardResponse<T>(response);
      } catch (error) {
         return errorToStandardResponse<T>(error as AxiosError);
      }
   },
};

export default apiClient;
