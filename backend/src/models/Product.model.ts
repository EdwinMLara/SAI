import mongoose, { Schema } from 'mongoose';
import { ProductInterface } from '@interfaces/Product.interfaces';

const ProductSchema: Schema = new Schema<ProductInterface>({
  key: { type: String, required: true, unique: true },
  clave: { type: String, required: true },/*Quitamos unique de clave ya que algunas de estas
  se repiten en la base de datos esta clave hace referencia a la imagen del producto*/
  description: { type: String, required: true },
  prices: {
    distribution: { type: Number, required: true, default: 0 },
    wholesale: { type: Number, required: true, default: 0 },
    mid_wholesale: { type: Number, required: true, default: 0 },
    retail: { type: Number, required: true, default: 0 },
  },
});

export default mongoose.model<ProductInterface>('Products', ProductSchema);
