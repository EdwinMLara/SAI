import mongoose, { Schema } from 'mongoose';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

const InvoiceSchema: Schema = new Schema<InvoiceInterface>({
  invoiceId: { type: String, required: true, unique: true },
  reference: { type: String, default: null },
  emisorRfc: { type: String, default: '' },
  emisorNombre: { type: String, default: '' },
  receptorRfc: { type: String, default: '' },
  receptorNombre: { type: String, default: '' },
  date: { type: Date, required: true },
  expiration: { type: Date, required: true },
  subtotal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  products: [
    {
      key: { type: String, required: true },
      claveProdServ: { type: String, default: '' },
      claveUnidad: { type: String, default: '' },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      status: { type: String, required: true },
      prices: {
        payment: { type: Number, required: true },
        iva: { type: Number, default: 0 },
        priceWithIva: { type: Number, default: 0 },
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
      transaction: { type: String, required: true },
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      status: { type: String, required: true },
      voucher: { type: String, default: null },
    },
  ],
  document: { type: String, default: null },
});

export default mongoose.model<InvoiceInterface>('Invoices', InvoiceSchema);
