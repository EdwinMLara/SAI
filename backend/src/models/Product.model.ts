import mongoose, { Schema, Document } from 'mongoose';

import { ProductInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export interface ProductDoc extends ProductInt, Document {}

const ProductSchema: Schema = new Schema<ProductDoc>(
   {
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
      catalog: { type: Boolean, required: true },
   },
   {
      timestamps: { createdAt: true, updatedAt: false },
   }
);

export default mongoose.model<ProductDoc>('Products', ProductSchema);
