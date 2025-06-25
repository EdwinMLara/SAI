import mongoose, { Schema } from 'mongoose';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

const InvoiceSchema: Schema = new Schema<InvoiceInterface>({
  id: { type: String, required: true, unique: true },
  reference: { type: String, default: null },
  date: { type: Date, required: true },
  expiration: { type: Date, required: true },
  products: [
    {
      key: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      status: { type: String, required: true },
      prices: {
        payment: { type: Number, required: true },
        distribution: { type: Number, required: true },
        wholesale: { type: Number, required: true },
        mid_wholesale: { type: Number, required: true },
        retail: { type: Number, required: true },
      },
      user_config: [
        {
          name: { type: String, required: true },
          role: { type: String, required: true },
          needs: { type: Number, required: true },
          use: {
            use_factor: { type: String },
            gain_factor: { type: Number, required: true },
            pay: { type: Number, required: true },
          },
        },
      ],
    },
  ],
  payments: [
    {
      user: { type: String, required: true },
      transaction: { type: String, required: true, unique: true },
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      status: { type: String, required: true },
      voucher: { type: String, default: null },
    },
  ],
  document: { type: String, default: null },
});

export default mongoose.model<InvoiceInterface>('Invoices', InvoiceSchema);
