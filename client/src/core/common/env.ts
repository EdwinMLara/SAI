import dotenv from 'dotenv';
dotenv.config();

const envOptions = ['NODE_ENV', 'SERVER_IP', 'SERVER_PORT'];

envOptions.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVER_IP: process.env.SERVER_IP || '',
  SERVER_PORT: process.env.SERVER_PORT || '',
};

export default env;
