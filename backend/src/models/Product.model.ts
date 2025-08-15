import mongoose, { Schema } from 'mongoose';
import { ProductInterface } from '@interfaces/Product.interfaces';

const ProductSchema: Schema = new Schema<ProductInterface>({
  key: { type: String, required: true, unique: true },
  clave: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  prices: {
    distribution: { type: Number, required: true, default: 0 },
    wholesale: { type: Number, required: true, default: 0 },
    mid_wholesale: { type: Number, required: true, default: 0 },
    retail: { type: Number, required: true, default: 0 },
  },
});

export default mongoose.model<ProductInterface>('Products', ProductSchema);
