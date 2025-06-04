import { RequestHandler } from 'express';
import logger from '../utils/logger';

import ProductDocument from '../models/Product.model';

const getProduct: RequestHandler = async (req, res): Promise<void> => {
  const { key } = req.query;

  if (!key) {
    logger.error('The search key was not received correctly.');
    res.status(400).json({
      message: 'The search key was not received correctly.',
    });
    return;
  }

  try {
    const product = await ProductDocument.findOne({ key });

    if (!product) {
      res.status(404).json({
        message: 'Product not found',
      });
      return;
    }
    res.status(200).json({
      message: 'Product found',
      product: product?.toObject(),
    });
  } catch (error) {
    logger.error('Error while retrieving the product:', error);
    res.status(500).json({
      message: 'Internal Server Error. Could not get product.',
    });
  }
};

export default getProduct;
