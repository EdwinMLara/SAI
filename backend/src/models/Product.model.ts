import mongose, { Schema } from 'mongoose';
import { ProductInterface } from '../interfaces/Product.interfaces';

const ProductSchema: Schema = new Schema<ProductInterface>({
  key: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  prices: {
    distribution: { type: Number, required: true },
    wholesale: { type: Number, required: true },
    mid_wholesale: { type: Number, required: true },
    retail: { type: Number, required: true },
  },
});

export default mongose.model<ProductInterface>('Products', ProductSchema);
