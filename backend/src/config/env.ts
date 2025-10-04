import dotenv from 'dotenv';

dotenv.config({ path: './.env', quiet: true });

const envOptions = [
   'NODE_ENV',
   'SERVER_IP',
   'SERVER_PORT',
   'ORIGIN_SERVER',
   'ORIGIN_CLIENT',
   'MONGO_URI',
   'MONGO_URI',
];

envOptions.forEach((key) => {
   if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
   }
});

const env = {
   NODE_ENV: process.env.NODE_ENV || '',
   SERVER_IP: process.env.SERVER_IP || '',
   SERVER_PORT: process.env.SERVER_PORT || '',
   ORIGIN_SERVER: process.env.ORIGIN_SERVER || '',
   ORIGIN_CLIENT: process.env.ORIGIN_CLIENT || '',
   MONGO_URI: process.env.MONGO_URI || '',
};

export default env;
