import mongoose, { Schema } from 'mongoose';
import { DatabaseUpdateInterface } from '@interfaces/extras/DatabaseUpdate.interfaces';

const DatabaseUpdateSchema: Schema = new Schema<DatabaseUpdateInterface>({
  type: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  totalRecords: { type: Number, required: true },
});

export default mongoose.model<DatabaseUpdateInterface>(
  'DatabaseUpdates',
  DatabaseUpdateSchema
);
