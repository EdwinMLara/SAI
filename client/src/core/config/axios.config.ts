import axios, { AxiosResponse, AxiosError } from 'axios';

import { ApiResponse } from '@interfaces/Api.interfaces';

import env from '../common/env';

/* ------------------ Code ------------------ */

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

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
  (error: AxiosError) => {
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
