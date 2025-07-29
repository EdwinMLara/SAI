import { Request, Response, NextFunction } from 'express';

import * as helpers from '@helpers/Invoice.helpers';
import * as services from '@services/Invoice.services';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createInvoice(
  req: Request<{}, {}, InvoiceInterface>,
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

export async function getInvoice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoiceId = helpers.getQuery(req.query.id);
    await helpers.comprobeExistence(invoiceId);
    const invoice = await services.getInvoice(invoiceId);
    res.status(200).json({
      message: responses.System.ok,
      invoice: invoice,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function updateInvoice(
  req: Request<{}, {}, InvoiceInterface>,
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

export async function deleteInvoice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoiceId = helpers.getQuery(req.query.id);
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
