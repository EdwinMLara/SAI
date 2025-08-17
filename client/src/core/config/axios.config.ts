import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import { ApiResponse } from '@interfaces/Api.interfaces';

import env from '../common/env';

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = error.response.data as any;

      if (errorData.refresh === true && errorData.access === false) {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            const refreshResponse = await axios.get('/auth/refresh');
            if (refreshResponse.status === 200) {
              isRefreshing = false;
              onRefreshed();
              return axios(originalRequest);
            }
          } catch (refreshError) {
            isRefreshing = false;
            onRefreshed();
            window.dispatchEvent(new CustomEvent('auth:logout'));
            return Promise.reject(refreshError);
          }
        } else {
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
