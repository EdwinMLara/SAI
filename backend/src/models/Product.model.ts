import mongoose, { Schema } from 'mongoose';
import { ProductDocument } from '@interfaces/ExtendsModel';

const ProductSchema: Schema = new Schema<ProductDocument>({
   code: { type: String, required: true, unique: true, index: true },
   key: { type: String, required: true, unique: true, index: true },
   description: { type: String, required: true },
   prices: {
      distribution: { type: Number, required: true },
      wholesale: { type: Number, required: true },
      mid_wholesale: { type: Number, required: true },
      retail: { type: Number, required: true },
   },
   details: {
      brand: { type: String, required: true },
      satCode: { type: String, required: true },
   },
});

export default mongoose.model<ProductDocument>('Products', ProductSchema);
