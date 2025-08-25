const envOptions = ['NODE_ENV', 'API_HOST', 'API_PORT'];

const env = {
   NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
   API_HOST: import.meta.env.VITE_API_HOST || '0.0.0.0',
   API_PORT: import.meta.env.VITE_API_PORT || '5001',
};

export default env;
