import { Document } from 'mongoose';

export interface LogMetadata {
  user: string;
  clientIp: string;
  stackTrace: string;
  endpoint: string;
  method: string;
  statusCode: number;
}

export interface LogInterface extends Document {
  timestamp: Date;
  level: string;
  message: string;
  metadata?: LogMetadata;
}
