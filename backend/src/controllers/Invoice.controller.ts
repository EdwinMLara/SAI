import { Request, Response, NextFunction } from 'express';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';
import * as helpers from '@helpers/Invoice.helpers';
import * as services from '@services/Invoice.services';

import { InvoiceInt } from '@cmm_interfaces/index';
import getParam from '@utils/system/getParam';

/* ------------------ Code ------------------ */

/**
 * Creates a new invoice in the system
 * Validates that the invoice ID doesn't already exist before creation
 * @param req - Express request object containing invoice data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function createInvoice(
   req: Request<object, object, InvoiceInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      await helpers.comprobeInexistence(req.body.invoiceId);
      await services.createInvoice(req.body);
      res.status(200).json({ message: responses.Invoice.created });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Retrieves a specific invoice by its ID
 * Validates invoice existence before returning data
 * @param req - Express request object with invoice ID in params parameters
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function getInvoice(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = getParam(req.params.id);
      await helpers.comprobeExistence(invoiceId);
      const invoice = await services.getInvoice(invoiceId);
      res.status(200).json({
         message: responses.System.ok,
         data: { invoice: invoice },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Updates an existing invoice with new data
 * Validates invoice existence before updating
 * @param req - Express request object containing updated invoice data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function updateInvoice(
   req: Request<object, object, InvoiceInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      await helpers.comprobeExistence(req.body.invoiceId);
      await services.updateInvoice(req.body, req.body.invoiceId);
      res.status(200).json({ message: responses.Invoice.updated });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Deletes an invoice from the system
 * Validates invoice existence before deletion
 * @param req - Express request object with invoice ID in params parameters
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function deleteInvoice(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = getParam(req.params.id);
      await helpers.comprobeExistence(invoiceId);
      await services.deleteInvoice(invoiceId);
      res.status(200).json({ message: responses.Invoice.deleted });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
