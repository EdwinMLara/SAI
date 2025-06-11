import { Request, Response } from 'express';
import { ProductInterface } from '../interfaces/Product.interfaces';
import * as productService from '../services/Product.services';
import logger from '../utils/logger';

export async function createProduct(
  req: Request<{}, {}, ProductInterface>,
  res: Response
): Promise<void> {
  try {
    const result = await productService.createProduct(req.body);

    res.statusMessage = result.message;
    res.status(result.status).json();
  } catch (error) {
    logger.error('Error creating product:', error);
    res.statusMessage = 'Internal Server Error. Could not create product.';
  }
}

export async function getProduct(
  req: Request,
  res: Response<{}, ProductInterface>
): Promise<void> {
  if (!req.query.key) {
    res.statusMessage = 'Bad Request. Product key is required.';
    res.status(400);
    return;
  }

  try {
    const result = await productService.getProduct(req.query.key as string);
    res.statusMessage = result.message;
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Error retrieving product:', error);
    res.statusMessage = 'Internal Server Error. Could not retrieve product.';
    res.status(500);
  }
}

export async function updateProduct(
  req: Request<{}, {}, ProductInterface>,
  res: Response
): Promise<void> {
  if (!req.query.key) {
    res.statusMessage = 'Bad Request. Product key is required.';
    res.status(400);
    return;
  }

  try {
    const result = await productService.updateProduct(
      req.body,
      req.query.key as string
    );
    res.statusMessage = result.message;
    res.status(result.status).json();
  } catch (error) {
    logger.error('Error updating product:', error);
    res.statusMessage = 'Internal Server Error. Could not update product.';
    res.status(500);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.query.key) {
    res.statusMessage = 'Bad Request. Product key is required.';
    res.status(400);
    return;
  }

  try {
    const result = await productService.deleteProduct(req.query.key as string);
    res.statusMessage = result.message;
    res.status(result.status).json();
  } catch (error) {
    logger.error('Error deleting product:', error);
    res.statusMessage = 'Internal Server Error. Could not delete product.';
    res.status(500);
  }
}
