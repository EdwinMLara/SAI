/**
 * Environment configuration module
 * Loads and validates all required environment variables using dotenv
 * Ensures application fails fast if critical configuration is missing
 * Provides type-safe access to environment variables throughout the application
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * List of required environment variables
 * Application will throw an error if any of these are missing
 */
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
];

/**
 * Validates that all required environment variables are present
 * Throws descriptive error if any variable is missing
 */
envOptions.forEach((key) => {
   if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
   }
});

/**
 * Validated environment configuration object
 * Provides type-safe access to all environment variables with fallback empty strings
 * Used throughout the application for configuration values
 */
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
};

export default env;
