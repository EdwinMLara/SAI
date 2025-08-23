import { Request, Response, NextFunction } from 'express';

import * as services from '@services/Document.services';
import * as helpers from '@helpers/Document.helpers';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function uploadFile(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = helpers.getQuery(req.query.invoiceId);
      const filename = `document_${invoiceId}.pdf`;
      await helpers.comprobeInexistence(filename);
      const file = (req as any).file as Express.Multer.File;
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

export async function updateDocument(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const invoiceId = helpers.getQuery(req.query.invoiceId);
      const filename = `document_${invoiceId}.pdf`;
      await helpers.comprobeExistence(filename);
      const file = (req as any).file as Express.Multer.File;
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
