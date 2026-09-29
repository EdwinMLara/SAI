import dotenv from 'dotenv';
dotenv.config();

const envOptions = [
  'NODE_ENV',
  'MONGO_URI',
  'SUPA_URL',
  'SUPA_KEY',
  'JWT_SECRET',
  'BUCKET_DOCS',
  'BUCKET_TICKET',
  'SERVER_IP',
  'SERVER_PORT',
  'ORIGIN_SERVER',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
];

envOptions.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const env = {
  NODE_ENV: process.env.NODE_ENV || '',
  MONGO_URI: process.env.MONGO_URI || '',
  SUPA_URL: process.env.SUPA_URL || '',
  SUPA_KEY: process.env.SUPA_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  BUCKET_DOCS: process.env.BUCKET_DOCS || '',
  BUCKET_TICKET: process.env.BUCKET_TICKET || '',
  SERVER_IP: process.env.SERVER_IP || '',
  SERVER_PORT: process.env.SERVER_PORT || '',
  ORIGIN_SERVER: process.env.ORIGIN_SERVER || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
};

export default env;
