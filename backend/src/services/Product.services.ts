import ProductModel from '../models/Product.model';
import { ProductInterface } from '../interfaces/Product.interfaces';

export async function createProduct(product: ProductInterface): Promise<{
  status: number;
  message: string;
}> {
  const newProduct = new ProductModel(product);
  await newProduct.save();

  return {
    status: 201,
    message: 'Product created successfully.',
  };
}

export async function readProduct(key: string): Promise<{
  status: number;
  message: string;
  data?: ProductInterface;
}> {
  const response = await ProductModel.findOne({ key });

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
  await ProductModel.deleteOne({ key });

  return {
    status: 200,
    message: 'Product deleted successfully.',
  };
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
      message: 'Update sucessfull database',
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Internal Server Error. Could not delete products.',
    };
  }
}
