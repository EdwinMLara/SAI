import mongoose, { Schema } from 'mongoose';
import { SalesNoteInterface } from '@interfaces/SalesNote.interfaces';

const SalesNoteSchema: Schema = new Schema<SalesNoteInterface>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    customer: {
      name: { type: String, required: true, trim: true },
      rfc: { type: String, default: null, uppercase: true, trim: true },
      email: { type: String, default: null, lowercase: true, trim: true },
      phone: { type: String, default: null, trim: true },
      address: { type: String, default: null, trim: true },
    },
    products: [
      {
        type: {
          type: String,
          enum: ['resale', 'new', 'service'],
          default: 'resale',
        },
        description: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 0 },
        purchasePrice: { type: Number, default: 0, min: 0 },
        unitPrice: { type: Number, required: true, min: 0 },
        subtotal: { type: Number, default: 0, min: 0 },
        iva: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: { type: Number, default: 0, min: 0 },
    iva: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    comments: { type: String, default: null },
    terms: { type: String, default: null },
    fiscalStamp: {
      satStamp: { type: String, default: null },
      issuerStamp: { type: String, default: null },
      originalString: { type: String, default: null },
      stampedAt: { type: Date, default: null },
      qrString: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ['draft', 'stamped'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export default mongoose.model<SalesNoteInterface>('SalesNotes', SalesNoteSchema);
