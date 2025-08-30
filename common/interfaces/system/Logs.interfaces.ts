import { Document } from 'mongoose';

/**
 * Log metadata interface containing request and user context information
 * Used for tracking and debugging system operations
 */
export interface LogMetadataInt {
   clientIp: string;
   stackTrace: string;
   endpoint: string;
   method: string;
   statusCode: number;
}

/**
 * Base log entry interface defining the structure of system log entries
 * Contains timestamp, type classification, message, and optional metadata
 */
export interface LogInt {
   timestamp: Date;
   type: string;
   message: string;
   metadata?: LogMetadataInt;
}

/**
 * Extended Document interface for Log collection
 * Combines LogInt with MongoDB Document functionality
 */
export interface LogDocument extends LogInt, Document {}
