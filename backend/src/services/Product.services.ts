import ProductModel from '../models/Product.model';
import { ProductInterface } from '../interfaces/Product.interfaces';

export async function createProduct(product: ProductInterface): Promise<{
  status: number;
  message: string;
}> {
  const existingProduct = await ProductModel.findOne({ key: product.key });

  if (existingProduct) {
    return {
      status: 409,
      message: 'Product already exists.',
    };
  }

  const newProduct = new ProductModel(product);
  await newProduct.save();

  return {
    status: 201,
    message: 'Product created successfully.',
  };
}

export async function getProduct(key: string): Promise<{
  status: number;
  message: string;
  data?: ProductInterface;
}> {
  const response = await ProductModel.findOne({ key });

  if (!response) {
    return {
      status: 404,
      message: 'Product not found.',
    };
  }

  return {
    status: 200,
    message: 'Product retrieved successfully.',
    data: response as ProductInterface,
  };
}

export async function updateProduct(
  product: ProductInterface,
  key: string
): Promise<{
  status: number;
  message: string;
}> {
  const existingProduct = await ProductModel.findOne({ key });
  const duplicateProduct = await ProductModel.findOne({
    key: product.key,
  });

  if (!existingProduct) {
    return {
      status: 404,
      message: 'Product not found.',
    };
  }
  if (duplicateProduct && duplicateProduct.key !== key) {
    return {
      status: 409,
      message: 'Product already exists with the same key.',
    };
  }

  await ProductModel.updateOne({ key }, { $set: product });
  return {
    status: 200,
    message: 'Product updated successfully.',
  };
}

export async function deleteProduct(key: string): Promise<{
  status: number;
  message: string;
}> {
  const existingProduct = await ProductModel.findOne({ key });

  if (!existingProduct) {
    return {
      status: 404,
      message: 'Product not found.',
    };
  }

  await ProductModel.deleteOne({ key });

  return {
    status: 200,
    message: 'Product deleted successfully.',
  };
}
