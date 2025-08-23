const envOptions = ['NODE_ENV', 'SERVER_IP', 'SERVER_PORT'];

const env = {
   NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
   SERVER_IP: import.meta.env.VITE_SERVER_IP || '',
   SERVER_PORT: import.meta.env.VITE_SERVER_PORT || '',
};

export default env;
