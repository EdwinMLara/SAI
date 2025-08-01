import { Request, Response, NextFunction } from 'express';

import * as services from '@services/Ticket.services';
import * as helpers from '@helpers/Ticket.helpers';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export async function uploadFile(
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketId = helpers.getQuery(req.query.ticketId);
    const filename = `ticket_${ticketId}.pdf`;
    await helpers.comprobeInexistence(filename);
    const url = await services.uploadFile(req.file, filename);

    res.status(200).json({
      message: responses.Ticket.generated,
      url: url,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function readTicketURL(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketId = helpers.getQuery(req.query.ticketId);
    const filename = `ticket_${ticketId}.pdf`;
    await helpers.comprobeExistence(filename);
    const url = await services.getUrlFile(filename);
    res.status(200).json({ message: responses.System.ok, url: url });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function updateTicket(
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketId = helpers.getQuery(req.query.ticketId);
    const filename = `ticket_${ticketId}.pdf`;
    await helpers.comprobeExistence(filename);
    const url = await services.updateFile(req.file, filename);
    res.status(200).json({ message: responses.Ticket.updated, url: url });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketId = helpers.getQuery(req.query.ticketId);
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
