import { Request, Response } from 'express';
import { ProductInterface } from '@interfaces/Product.interfaces';

import * as productService from '@services/Product.services';
import * as productValidations from '@controllers/validations/Product.validations';

import logger from '@utils/logger';

export async function createProduct(
  req: Request<{}, {}, ProductInterface>,
  res: Response
): Promise<void> {
  try {
    const exists = await productValidations.exists(req.body.key as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if product exists',
      });
      return;
    }

    if (exists.pass) {
      res.status(409).json({
        message: 'Product already exists',
      });
      return;
    }

    const request = await productService.createProduct(req.body);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export async function readProduct(
  req: Request,
  res: Response<{}, ProductInterface>
): Promise<void> {
  if (!req.query.key) {
    res.status(400).json({
      message: 'Bad Request. Product key is required.',
    });
    return;
  }

  try {
    const exists = await productValidations.exists(req.query.key as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if product exists',
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: 'Product not found',
      });
      return;
    }

    const request = await productService.readProduct(req.query.key as string);
    res.status(request.status).json({
      message: request.message,
      product: request.data,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export async function updateProduct(
  req: Request<{}, {}, ProductInterface>,
  res: Response
): Promise<void> {
  try {
    const exists = await productValidations.exists(req.body.key as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if product exists',
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: 'Product does not exist',
      });
      return;
    }

    const request = await productService.updateProduct(
      req.body,
      req.body.key as string
    );
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.query.key) {
    res.status(400).json({
      message: 'Bad Request. Product key is required.',
    });
    return;
  }

  try {
    const exists = await productValidations.exists(req.query.key as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if product exists',
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: 'Product does not exist',
      });
      return;
    }

    const request = await productService.deleteProduct(req.query.key as string);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export async function changeProducts(
  req: Request<{}, {}, ProductInterface[]>,
  res: Response
): Promise<void> {
  try {
    const request = await productService.deleteDatabase(req.body);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}
