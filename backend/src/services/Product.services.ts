import ProductModel from '@models/Product.model';
import DatabaseUpdateModel from '@models/extras/DatabaseUpdate.model';

import { ProductInterface } from '@interfaces/Product.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createProduct(product: ProductInterface): Promise<void> {
  try {
    const newProduct = new ProductModel(product);
    await newProduct.save();
  } catch (error) {
    throw error;
  }
}

export async function getProduct(
  keyProduct: string
): Promise<ProductInterface> {
  try {
    const response = await ProductModel.findOne({ key: keyProduct });

    if (!response) {
      throw new AppError(responses.Product.notFound, 404);
    }

    return response as ProductInterface;
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

export async function replaceAllProducts(
  data: ProductInterface[]
): Promise<void> {
  const session = await ProductModel.startSession();
  session.startTransaction();
  try {
    await ProductModel.deleteMany({}, { session });
    await ProductModel.insertMany(data, { session });

    const updateRecord = new DatabaseUpdateModel({
      type: 'PRODUCTS_FULL_REPLACE',
      timestamp: new Date(),
      totalRecords: data.length,
    });
    await updateRecord.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function getLastDatabaseUpdate(): Promise<Date | null> {
  try {
    const lastUpdate = await DatabaseUpdateModel.findOne({
      type: 'PRODUCTS_FULL_REPLACE',
    })
      .sort({ timestamp: -1 })
      .exec();

    return lastUpdate ? lastUpdate.timestamp : null;
  } catch (error) {
    throw error;
  }
}
