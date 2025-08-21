import ProductModel from '@models/Product.model';

import { ProductInt } from '@cmm_interfaces/index.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createProduct(product: ProductInt): Promise<void> {
  try {
    const newProduct = new ProductModel(product);
    await newProduct.save();
  } catch (error) {
    throw error;
  }
}

export async function getProduct(keyProduct: string): Promise<ProductInt> {
  try {
    const response = await ProductModel.findOne({ key: keyProduct });

    if (!response) {
      throw new AppError(responses.Product.notFound, 404);
    }

    return response as ProductInt;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(keyProduct: string): Promise<void> {
  try {
    await ProductModel.deleteOne({ key: keyProduct });
  } catch (error) {
    throw error;
  }
}

export async function existProduct(keyProduct: string): Promise<boolean> {
  try {
    const product = await ProductModel.findOne({ key: keyProduct });
    return !!product;
  } catch (error) {
    throw error;
  }
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
