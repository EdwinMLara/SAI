import mongoose, { Schema, Document } from 'mongoose';

import { LogInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export interface LogDoc extends LogInt, Document {}

const LogSchema: Schema = new Schema<LogDoc>(
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

export default mongoose.model<LogDoc>('Log', LogSchema);
