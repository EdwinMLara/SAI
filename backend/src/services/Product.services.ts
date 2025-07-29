import ProductModel from '@models/Product.model';

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
