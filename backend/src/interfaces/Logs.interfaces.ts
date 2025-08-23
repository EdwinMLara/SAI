import { Document } from 'mongoose';

/* ------------------ Code ------------------ */

export interface LogMetadataInt {
   user: string;
   clientIp: string;
   stackTrace: string;
   endpoint: string;
   method: string;
   statusCode: number;
}

export interface LogInt {
   timestamp: Date;
   type: string;
   message: string;
   metadata?: LogMetadataInt;
}

export interface LogDocument extends LogInt, Document {}
