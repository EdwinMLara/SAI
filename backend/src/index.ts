/**
 * SAI System Backend Server
 * Main entry point for the Express.js application
 * Configures middleware, database connection, routing, and graceful shutdown
 */

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import env from '@config/env';
import router from '@routes';
import * as database from '@config/database';

import ErrorMiddleware from '@middlewares/Error.middleware';
import RequestMiddleware from '@middlewares/Request.middleware';
import ResponseMiddleware from '@middlewares/Response.middleware';

const app = express();

/**
 * Initialize database connection on startup
 */
(async () => {
   await database.connect();
})();

/**
 * Middleware configuration
 */
// Body parsing with increased limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cookie parsing for authentication tokens
app.use(cookieParser());

// CORS configuration for client-server communication
app.use(
   cors({
      origin: env.ORIGIN_CLIENT,
      credentials: true,
   })
);

// Request/Response logging and processing middleware
app.use(RequestMiddleware);
app.use(ResponseMiddleware);

/**
 * API routes
 */
app.use('/api', router);

/**
 * 404 handler for unknown routes
 */
app.use((req, res, next) => {
   res.status(404).json({ message: 'Route not found' });
});

/**
 * Global error handling middleware
 */
app.use(ErrorMiddleware);

/**
 * Server startup
 */
const server = app.listen(Number(env.SERVER_PORT), env.SERVER_IP, () => {
   console.log(`Express server on ${env.SERVER_IP}:${env.SERVER_PORT}`);
});

/**
 * Graceful shutdown handler
 * Ensures proper cleanup of database connections and server resources
 */
const gracefulShutdown = async () => {
   server.close(async () => {
      await database.disconnect();
      process.exit(0);
   });

   setTimeout(() => {
      process.exit(1);
   }, 10000);
};

/**
 * Process signal handlers for graceful shutdown
 */
process.on('SIGTERM', () => gracefulShutdown());
process.on('SIGINT', () => gracefulShutdown());
