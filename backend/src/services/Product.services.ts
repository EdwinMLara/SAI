import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';
import ProductModel from '@models/Product.model';

import { ProductInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

/**
 * Creates a new product in the database
 * @param product - Product data object conforming to ProductInt interface
 * @returns Promise<void>
 */
export async function createProduct(product: ProductInt): Promise<void> {
   const newProduct = new ProductModel(product);
   await newProduct.save();
}

/**
 * Retrieves a specific product by its key from the database
 * @param keyProduct - Unique key identifier for the product
 * @returns Promise<ProductInt> - The product data
 * @throws AppError if product is not found
 */
export async function getProduct(keyProduct: string): Promise<ProductInt> {
   const response = await ProductModel.findOne({ key: keyProduct });

   if (!response) {
      throw new AppError(responses.Product.notFound, 404);
   }

   return response as ProductInt;
}

/**
 * Deletes a product from the database
 * @param keyProduct - Unique key identifier for the product to delete
 * @returns Promise<void>
 */
export async function deleteProduct(keyProduct: string): Promise<void> {
   await ProductModel.deleteOne({ key: keyProduct });
}

/**
 * Checks if a product exists in the database
 * @param keyProduct - Unique key identifier for the product to check
 * @returns Promise<boolean> - True if product exists, false otherwise
 */
export async function existProduct(keyProduct: string): Promise<boolean> {
   const product = await ProductModel.findOne({ key: keyProduct });
   return !!product;
}

/**
 * Replaces all existing products with a new set of products in a transaction
 * Deletes all current products and inserts new ones atomically
 * @param data - Array of product data to replace existing products
 * @returns Promise<void>
 * @throws Error if transaction fails, rolls back all changes
 */
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

export async function lastUpdate(): Promise<ProductInt | null> {
   const [product] = await ProductModel.aggregate([{ $sample: { size: 1 } }]);
   return product ? (product as ProductInt) : null;
}
