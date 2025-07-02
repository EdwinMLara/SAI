import ProductModel from '@models/Product.model';
import responses from '@utils/responses';
import logger from '@utils/logger';

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
    logger.error('Error checking product existence:', error);
    return {
      pass: false,
      error: true,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}
