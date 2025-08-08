import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '@interfaces/Api.interfaces';

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const resData = response.data;

    if (resData.status && resData.data) {
      return {
        ...response,
        data: {
          status: resData.status,
          message: resData.data.message || resData.message || 'OK',
          data: resData.data,
        },
      };
    }

    return {
      ...response,
      data: {
        status: response.status,
        message: resData.message || 'Proceso Exitoso',
        data: resData,
      },
    };
  },
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorData = error.response.data as any;
      return Promise.resolve({
        ...error.response,
        data: {
          status: errorData.status || error.response.status,
          message: errorData.message || 'Error desconocido',
          data: errorData.data || errorData,
        },
      });
    }

    return Promise.resolve({
      data: {
        status: 500,
        message: 'Error de conexión con el servidor',
        data: null,
      },
    });
  }
);

export default axios;
