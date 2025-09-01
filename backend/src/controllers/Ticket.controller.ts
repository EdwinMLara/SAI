import { Request, Response, NextFunction } from 'express';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';
import * as helpers from '@helpers/Ticket.helpers';
import * as services from '@services/Ticket.services';
import getParam from '@utils/system/getParam';

/* ------------------ Code ------------------ */

/**
 * Uploads a new PDF ticket file
 * Validates that the ticket doesn't already exist before uploading
 * @param req - Express request object with ticketId in params and file in body
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
      const ticketId = getParam(req.params.ticketId);
      const filename = `ticket_${ticketId}.pdf`;
      await helpers.comprobeInexistence(filename);
      const file = (req as Request & { file: Express.Multer.File }).file;
      const url = await services.uploadFile(file, filename);
      res.status(200).json({
         message: responses.Ticket.generated,
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
 * Retrieves the URL of a ticket file
 * Validates that the ticket exists before returning its URL
 * @param req - Express request object with ticketId in params parameters
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function readTicketURL(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const ticketId = getParam(req.params.ticketId);
      const filename = `ticket_${ticketId}.pdf`;
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
 * Updates an existing ticket by replacing it with a new file
 * Validates ticket existence before updating
 * @param req - Express request object with ticketId in params and new file in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function updateTicket(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const ticketId = getParam(req.params.ticketId);
      const filename = `ticket_${ticketId}.pdf`;
      await helpers.comprobeExistence(filename);
      const file = (req as Request & { file: Express.Multer.File }).file;
      const url = await services.updateFile(file, filename);
      res.status(200).json({
         message: responses.Ticket.updated,
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
 * Deletes a ticket file from the system
 * Validates ticket existence before deletion
 * @param req - Express request object with ticketId in params parameters
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function deleteTicket(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const ticketId = getParam(req.params.ticketId);
      const filename = `ticket_${ticketId}.pdf`;
      await helpers.comprobeExistence(filename);
      await services.deleteFile(filename);
      res.status(200).json({ message: responses.Ticket.deleted });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
