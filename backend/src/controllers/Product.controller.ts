import { Request, Response, NextFunction } from 'express';
import { ProductInt } from '@cmm_interfaces/index';

import * as helpers from '@helpers/Product.helpers';
import * as services from '@services/Product.services';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function createProduct(
   req: Request<object, object, ProductInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      await helpers.comprobeInexistence(req.body.key);
      await services.createProduct(req.body);
      res.status(200).json({ message: responses.Product.created });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function getProduct(
   req: Request,
   res: Response<object, ProductInt>,
   next: NextFunction
): Promise<void> {
   try {
      const keyProduct = helpers.getQuery(req.query.key);
      await helpers.comprobeExistence(keyProduct);
      const product = await services.getProduct(keyProduct);
      res.status(200).json({
         message: responses.System.ok,
         data: { product: product },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function deleteProduct(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const keyProduct = helpers.getQuery(req.query.key);
      await helpers.comprobeExistence(keyProduct);
      await services.deleteProduct(keyProduct);
      res.status(200).json({ message: responses.Product.deleted });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function replaceAllProducts(
   req: Request<object, object, ProductInt[]>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      await services.replaceAllProducts(req.body);
      res.status(200).json({ message: responses.Product.replaced });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
