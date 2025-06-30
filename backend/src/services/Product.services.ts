import { ProductInterface } from '@interfaces/Product.interfaces';
import ProductModel from '@models/Product.model';
import responses from '@utils/responses';

export async function createProduct(product: ProductInterface): Promise<{
  status: number;
  message: string;
}> {
  const newProduct = new ProductModel(product);
  await newProduct.save();

  return {
    status: 201,
    message: responses.CREATED,
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
    message: responses.RETRIEVED,
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
    message: responses.UPDATED,
  };
}

export async function deleteProduct(key: string): Promise<{
  status: number;
  message: string;
}> {
  await ProductModel.deleteOne({ key });

  return {
    status: 200,
    message: responses.DELETED,
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
      message: responses.UPDATE_SUCCESS_DB,
    };
  } catch (error) {
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}
