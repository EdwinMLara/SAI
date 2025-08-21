const env = {
  NODE_ENV: import.meta.env.MODE || '',
  VITE_API_HOST: import.meta.env.VITE_API_HOST || '',
  VITE_API_PORT: import.meta.env.VITE_API_PORT || '',
};

export default env;
