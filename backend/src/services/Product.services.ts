import ProductModel from '@models/Product.model';

import { ProductInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function createProduct(product: ProductInt): Promise<void> {
   const newProduct = new ProductModel(product);
   await newProduct.save();
}

export async function getProduct(keyProduct: string): Promise<ProductInt> {
   const response = await ProductModel.findOne({ key: keyProduct });

   if (!response) {
      throw new AppError(responses.Product.notFound, 404);
   }

   return response as ProductInt;
}

export async function deleteProduct(keyProduct: string): Promise<void> {
   await ProductModel.deleteOne({ key: keyProduct });
}

export async function existProduct(keyProduct: string): Promise<boolean> {
   const product = await ProductModel.findOne({ key: keyProduct });
   return !!product;
}

export async function replaceAllProducts(data: ProductInt[]): Promise<void> {
   const session = await ProductModel.startSession();
   session.startTransaction();
   try {
      await ProductModel.deleteMany({}, { session });
      await ProductModel.insertMany(data, { session });
      await session.commitTransaction();
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      session.endSession();
   }
}
