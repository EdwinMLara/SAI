import { NextFunction, Request, Response } from 'express';

import * as helpers from '@helpers/SalesNote.helpers';
import {
  ParsedFiscalStamp,
  parseFiscalStampXML,
} from '@helpers/SalesNoteXML.helpers';
import * as services from '@services/SalesNote.services';

import {
  SalesNoteFiscalUpdate,
  SalesNoteInterface,
} from '@interfaces/SalesNote.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

function parseUploadedFiscalStamp(req: Request): ParsedFiscalStamp {
  const file = (req as Request & { file?: Express.Multer.File }).file;

  if (!file) {
    throw new AppError(responses.SalesNote.requiredXml, 400);
  }

  try {
    const fiscalStamp = parseFiscalStampXML(file.buffer.toString('utf-8'));
    helpers.validateFiscalStampData(fiscalStamp);
    return fiscalStamp;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.SalesNote.invalidXml, 400);
  }
}

export async function createSalesNote(
  req: Request<Record<string, never>, unknown, SalesNoteInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    helpers.validatePayload(req.body);
    await helpers.comprobeInexistence(req.body.reference);

    const totals = helpers.normalizeTotals(req.body.products);

    req.body.products = totals.products;
    req.body.subtotal = totals.subtotal;
    req.body.iva = totals.iva;
    req.body.total = totals.total;
    req.body.date = req.body.date || new Date();

    if (helpers.hasAnyFiscalData(req.body.fiscalStamp)) {
      helpers.validateFiscalStampData(req.body.fiscalStamp);
      req.body.status = 'stamped';
    } else {
      req.body.status = 'draft';
      req.body.fiscalStamp = {
        satStamp: null,
        issuerStamp: null,
        originalString: null,
        stampedAt: null,
        qrString: null,
      };
    }

    const note = await services.createSalesNote(req.body);

    res.status(201).json({
      message: responses.SalesNote.created,
      note,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function getAllSalesNotes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pageParam = req.query.page as string | undefined;
    const limitParam = req.query.limit as string | undefined;

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 10;

    const result = await services.getAllSalesNotes(page, limit);

    res.status(200).json({
      message: responses.System.ok,
      ...result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function getSalesNote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reference = helpers.getQuery(req.query.reference);
    await helpers.comprobeExistence(reference);

    const note = await services.getSalesNote(reference);

    res.status(200).json({
      message: responses.System.ok,
      note,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function updateSalesNote(
  req: Request<Record<string, never>, unknown, SalesNoteInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    helpers.validatePayload(req.body);
    await helpers.comprobeExistence(req.body.reference);

    const totals = helpers.normalizeTotals(req.body.products);

    req.body.products = totals.products;
    req.body.subtotal = totals.subtotal;
    req.body.iva = totals.iva;
    req.body.total = totals.total;

    const note = await services.updateSalesNote(req.body.reference, req.body);

    res.status(200).json({
      message: responses.SalesNote.updated,
      note,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function updateFiscalStamp(
  req: Request<Record<string, never>, unknown, SalesNoteFiscalUpdate>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    helpers.validateFiscalStamp(req.body);
    await helpers.comprobeExistence(req.body.reference);

    const note = await services.updateFiscalStamp(req.body.reference, req.body);

    res.status(200).json({
      message: responses.SalesNote.stamped,
      note,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function parseFiscalStampXml(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const fiscalStamp = parseUploadedFiscalStamp(req);

    res.status(200).json({
      message: responses.SalesNote.xmlParsed,
      fiscalStamp,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function uploadFiscalStampXml(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reference = helpers.getQuery(req.body.reference);
    await helpers.comprobeExistence(reference);

    const fiscalStamp = parseUploadedFiscalStamp(req);

    const note = await services.updateFiscalStamp(reference, {
      reference,
      rfc: fiscalStamp.rfc,
      fiscalStamp: {
        satStamp: fiscalStamp.satStamp,
        issuerStamp: fiscalStamp.issuerStamp,
        originalString: fiscalStamp.originalString,
        stampedAt: fiscalStamp.stampedAt,
        qrString: fiscalStamp.qrString,
      },
    });

    res.status(200).json({
      message: responses.SalesNote.xmlParsed,
      note,
      fiscalStamp,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function deleteSalesNote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reference = helpers.getQuery(req.query.reference);
    await helpers.comprobeExistence(reference);
    await services.deleteSalesNote(reference);

    res.status(200).json({
      message: responses.SalesNote.deleted,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}
