import { Request, Response, NextFunction } from 'express';

import * as helpers from '@helpers/Invoice.helpers';
import { parseInvoiceXML } from '@helpers/InvoiceXML.helpers';
import * as services from '@services/Invoice.services';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function uploadXML(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = (req as any).file as Express.Multer.File;
    const xmlString = file.buffer.toString('utf-8');

    let invoiceData: InvoiceInterface;
    try {
      invoiceData = parseInvoiceXML(xmlString);
    } catch (error) {
      return next(new AppError(responses.Invoice.invalidFormat, 400));
    }

    await helpers.comprobeInexistence(invoiceData.invoiceId);
    await services.createInvoice(invoiceData);
    res.status(200).json({
      message: responses.Invoice.uploadSuccess,
      invoice: invoiceData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

/*Funcion para traer todas las facturas disponibles */
export async function getAllInvoices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Extraemos los parámetros del query string
    const pageParam = req.query.page as string | undefined;
    const limitParam = req.query.limit as string | undefined;
    const monthParam = req.query.month as string | undefined;

    // 2. Convertimos a números y validamos que sean positivos
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 5;

    // 3. Llamamos al servicio pasando los parámetros parseados
    const result = await services.getAllInvoices(page, limit, monthParam);

    // 4. Respondemos con éxito y la estructura estandarizada
    res.status(200).json({
      message: responses.System.ok,
      invoices: result.invoices,
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

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
