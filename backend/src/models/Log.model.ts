import mongoose, { Schema } from 'mongoose';
import { LogDocument } from '@cmm_interfaces/system/Logs.interfaces';

const LogSchema: Schema = new Schema<LogDocument>(
   {
      timestamp: { type: Date, required: true },
      type: { type: String, required: true },
      message: { type: String, required: true },
      metadata: {
         clientIp: { type: String, required: true },
         stackTrace: { type: String, required: true },
         endpoint: { type: String, required: true },
         method: { type: String, required: true },
         statusCode: { type: Number, required: true },
      },
   },
   {
      timestamps: false,
   }
);

export default mongoose.model<LogDocument>('Log', LogSchema);
