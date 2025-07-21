import ProductModel from '@models/Product.model';
import responses from '@utils/responses';

export interface ProductValidationResponse {
  pass: boolean;
  error?: boolean;
  message?: string;
}

export async function exists(key: string): Promise<ProductValidationResponse> {
  try {
    const result = await ProductModel.findOne({ key });
    return {
      pass: !!result,
      message: result ? responses.ALREADY_EXISTS : responses.NOT_FOUND,
    };
  } catch (error) {
    return {
      pass: false,
      error: true,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}
