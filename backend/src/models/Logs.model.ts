import mongoose, { Schema } from 'mongoose';
import { LogInterface, LogMetadata } from '@interfaces/Logs.interfaces';

const MetadataSchema: Schema = new Schema<LogMetadata>(
  {
    from: { type: String, required: true },
    user: { type: String, required: true },
    clientIp: { type: String, required: true },
    stackTrace: { type: String, required: true },
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    statusCode: { type: Number, required: true },
  },
  {
    _id: false,
    timestamps: false,
  }
);

const LogSchema: Schema = new Schema<LogInterface>(
  {
    timestamp: { type: Date, required: true },
    level: { type: String, required: true },
    message: { type: String, required: true },
    origin: { type: String, required: true },
    metadata: { type: MetadataSchema, required: false },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model<LogInterface>('Logs', LogSchema);
