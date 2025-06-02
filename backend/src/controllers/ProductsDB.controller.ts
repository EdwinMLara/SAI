import { Request, Response } from 'express';
import logger from '../utils/logger';

import Product from '../models/Product.model';
import { ProductInterface } from '../interfaces/Product.interfaces';

const createProduct = async (
  req: Request<{}, {}, ProductInterface>,
  res: Response
) => {
  const requestBody = req.body;
  if (!requestBody || typeof requestBody !== 'object') {
    res.status(400).json({
      status: 400,
      message: 'Bad Request. Request body must be a valid object.',
    });
  }

  const modelProduct = new Product(requestBody);

  try {
    const newProduct = await modelProduct.save();
    res.status(201).json({
      status: 201,
      message: 'Product created successfully.',
      product: newProduct.toObject(),
    });
  } catch (error) {
    logger.error('Error creating product:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error. Could not create product.',
    });
  }
};

export default createProduct;
