import { Request, Response, NextFunction } from 'express';
import { ProductInterface } from '@interfaces/Product.interfaces';

import * as productService from '@services/Product.services';
import * as productValidations from '@controllers/validations/Product.validations';

import responses from '@utils/responses';

export async function createProduct(
  req: Request<{}, {}, ProductInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const exists = await productValidations.exists(req.body.key as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (exists.pass) {
      res.status(409).json({
        message: responses.PRODUCT_ALREADY_EXISTS,
      });
      return;
    }

    const request = await productService.createProduct(req.body);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function readProduct(
  req: Request,
  res: Response<{}, ProductInterface>,
  next: NextFunction
): Promise<void> {
  if (!req.query.key) {
    res.status(400).json({
      message: responses.BAD_REQUEST,
    });
    return;
  }

  try {
    const exists = await productValidations.exists(req.query.key as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: responses.PRODUCT_NOT_FOUND,
      });
      return;
    }

    const request = await productService.readProduct(req.query.key as string);
    res.status(request.status).json({
      message: request.message,
      product: request.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request<{}, {}, ProductInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const exists = await productValidations.exists(req.body.key as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: responses.PRODUCT_NOT_FOUND,
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
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.query.key) {
    res.status(400).json({
      message: responses.BAD_REQUEST,
    });
    return;
  }

  try {
    const exists = await productValidations.exists(req.query.key as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: responses.PRODUCT_NOT_FOUND,
      });
      return;
    }

    const request = await productService.deleteProduct(req.query.key as string);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function changeProducts(
  req: Request<{}, {}, ProductInterface[]>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const request = await productService.deleteDatabase(req.body);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    next(error);
  }
}
