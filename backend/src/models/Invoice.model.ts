import mongoose, { Document, Schema } from 'mongoose';

import { InvoiceInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export interface InvoiceDoc extends InvoiceInt, Document {}

const InvoiceSchema: Schema = new Schema<InvoiceDoc>({
   invoiceId: { type: String, required: true, unique: true, index: true },
   documentId: { type: String, unique: true, index: true },
   initDate: { type: Date, required: true },
   expiration: { type: Date, required: true },
   products: [
      {
         productkey: { type: String, required: true },
         description: { type: String, required: true },
         quantityReception: { type: Number, required: true },
         statusReception: { type: String, required: true },
         prices: {
            payment: { type: Number, required: true },
            distribution: { type: Number, required: true },
            wholesale: { type: Number, required: true },
            mid_wholesale: { type: Number, required: true },
            retail: { type: Number, required: true },
         },
         userConfig: [
            {
               userId: {
                  type: Schema.Types.ObjectId,
                  required: true,
                  ref: 'User',
               },
               needs: { type: Number, required: true },
               use: {
                  use: { type: String, required: true },
                  gain: { type: Number, required: true },
                  pay: { type: Number, required: true },
               },
            },
         ],
      },
   ],
   payments: [
      {
         userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
         transactionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
         },
         transactionDate: { type: Date, required: true },
         amount: { type: Number, required: true },
         status: { type: String, required: true },
         voucherURL: { type: String, unique: true },
      },
   ],
   documentURL: { type: String, unique: true },
});

export default mongoose.model<InvoiceDoc>('Invoices', InvoiceSchema);
