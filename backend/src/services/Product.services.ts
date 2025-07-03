import { ProductInterface } from '@interfaces/Product.interfaces';
import ProductModel from '@models/Product.model';
import responses from '@utils/responses';
import logger from '@utils/logger';

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
    logger.error('Error creating product:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
    logger.error('Error reading product:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
    logger.error('Error updating product:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
    logger.error('Error deleting product:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
    logger.error('Error updating database:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}
