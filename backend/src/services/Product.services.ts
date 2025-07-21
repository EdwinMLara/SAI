import { ProductInterface } from '@interfaces/Product.interfaces';
import ProductModel from '@models/Product.model';
import responses from '@utils/responses';
import AppError from '@utils/AppError';

export async function createProduct(product: ProductInterface): Promise<{
  status: number;
  message: string;
}> {
  try {
    const newProduct = new ProductModel(product);
    await newProduct.save();

    return {
      status: 201,
      message: responses.PRODUCT_CREATED,
    };
  } catch (error) {
    throw error;
  }
}

export async function readProduct(key: string): Promise<{
  status: number;
  message: string;
  data?: ProductInterface;
}> {
  try {
    const response = await ProductModel.findOne({ key });

    if (!response) {
      return {
        status: 404,
        message: responses.PRODUCT_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.PRODUCT_FOUND,
      data: response as ProductInterface,
    };
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(
  product: ProductInterface,
  key: string
): Promise<{
  status: number;
  message: string;
}> {
  try {
    const result = await ProductModel.updateOne({ key }, { $set: product });

    if (result.matchedCount === 0) {
      return {
        status: 404,
        message: responses.PRODUCT_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.PRODUCT_UPDATED,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(key: string): Promise<{
  status: number;
  message: string;
}> {
  try {
    const result = await ProductModel.deleteOne({ key });

    if (result.deletedCount === 0) {
      return {
        status: 404,
        message: responses.PRODUCT_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.PRODUCT_DELETED,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteDatabase(products: ProductInterface[]): Promise<{
  status: number;
  message: string;
}> {
  try {
    await ProductModel.deleteMany({});
    await ProductModel.insertMany(products);

    return {
      status: 200,
      message: responses.PRODUCTS_DATABASE_UPDATED,
    };
  } catch (error) {
    throw error;
  }
}
