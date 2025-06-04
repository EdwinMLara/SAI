import { RequestHandler } from 'express';
import logger from '../utils/logger';

import ProductDocument from '../models/Product.model';

const getProduct: RequestHandler = async (req, res): Promise<void> => {
  const { key } = req.query;

  try {
    const product = await ProductDocument.findOne({ key });

    if (!product) {
      res.status(404).json({
        message: 'Producto no encontrado',
      });
      return;
    }
    res.status(200).json({
      message: 'Producto encontrado',
      product: product?.toObject(),
    });
  } catch (error) {
    logger.error('Error al obtener el producto:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error. Could not get product.',
    });
  }
};

export default getProduct;
