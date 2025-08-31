import { Request, Response, NextFunction } from 'express';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';
import * as helpers from '@helpers/Document.helpers';
import * as services from '@services/Document.services';

/* ------------------ Code ------------------ */

/**
 * Uploads a new PDF document file associated with an invoice
 * Validates that the document doesn't already exist before uploading
 * @param req - Express request object with invoiceId in query and file in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function uploadFile(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = helpers.getQuery(req.query.invoiceId);
      const filename = `document_${invoiceId}.pdf`;
      await helpers.comprobeInexistence(filename);
      const file = (req as Request & { file: Express.Multer.File }).file;
      const url = await services.uploadFile(file, filename);
      res.status(200).json({
         message: responses.Document.uploadSuccess,
         data: { url: url },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Retrieves the URL of a document associated with an invoice
 * Validates that the document exists before returning its URL
 * @param req - Express request object with invoiceId in query parameters
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function readDocumentURL(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = helpers.getQuery(req.query.invoiceId);
      const filename = `document_${invoiceId}.pdf`;
      await helpers.comprobeExistence(filename);
      const url = await services.getUrlFile(filename);
      res.status(200).json({
         message: responses.System.ok,
         data: { url: url },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Updates an existing document by replacing it with a new file
 * Validates document existence before updating
 * @param req - Express request object with invoiceId in query and new file in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function updateDocument(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = helpers.getQuery(req.query.invoiceId);
      const filename = `document_${invoiceId}.pdf`;
      await helpers.comprobeExistence(filename);
      const file = (req as Request & { file: Express.Multer.File }).file;
      const url = await services.updateFile(file, filename);
      res.status(200).json({
         message: responses.Document.updated,
         data: { url: url },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Deletes a document associated with an invoice
 * Validates document existence before deletion
 * @param req - Express request object with invoiceId in query parameters
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function deleteDocument(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = helpers.getQuery(req.query.invoiceId);
      const filename = `document_${invoiceId}.pdf`;
      await helpers.comprobeExistence(filename);
      await services.deleteFile(filename);
      res.status(200).json({ message: responses.Document.deleted });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
