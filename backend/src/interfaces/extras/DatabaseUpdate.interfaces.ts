import { Document } from 'mongoose';

export interface DatabaseUpdateInterface extends Document {
  type: string;
  timestamp: Date;
  totalRecords: number;
}
