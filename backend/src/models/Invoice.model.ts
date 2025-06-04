import mongoose, { Schema } from 'mongoose';
import { InvoiceInterface } from '../interfaces/Invoice.interfaces';

const InvoiceSchema: Schema = new Schema<InvoiceInterface>({
  invoice: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
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
            use_factor: { type: String, required: true },
            gain_factor: { type: Number, required: true },
            pay: { type: Number, required: true },
          },
        },
      ],
    },
  ],
  document: { type: String, required: true, default: null },
  voucher: { type: String, required: true, default: null },
});

export default mongoose.model<InvoiceInterface>('Invoices', InvoiceSchema);
