import mongoose, { Schema } from 'mongoose';
import { LogDocument } from '@interfaces/Logs.interfaces';

/* ------------------ Code ------------------ */

const LogSchema: Schema = new Schema<LogDocument>(
   {
      timestamp: { type: Date, required: true },
      type: { type: String, required: true },
      message: { type: String, required: true },
      metadata: {
         user: { type: String, required: true },
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
