export const baseURL = '0.0.0.0:5001';

const entrypoint = '/api';

const apiPath = {
   login: `${entrypoint}/login`,
   register: `${entrypoint}/register`,
};

export default apiPath;
