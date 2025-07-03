import { Request, Response } from 'express';

import * as invoiceService from '@services/Invoice.services';
import * as invoiceValidations from '@controllers/validations/Invoice.validations';

import logger from '@utils/logger';
import responses from '@utils/responses';

export async function createInvoice(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const exists = await invoiceValidations.exists(req.body.id as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (exists.pass) {
      res.status(409).json({
        message: responses.INVOICE_ALREADY_EXISTS,
      });
      return;
    }

    const request = await invoiceService.createInvoice(req.body);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function readInvoice(req: Request, res: Response): Promise<void> {
  if (!req.query.id) {
    res.status(400).json({
      message: responses.REQUIRED_INVOICE_ID,
    });
    return;
  }

  try {
    const exists = await invoiceValidations.exists(req.query.id as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: responses.INVOICE_NOT_FOUND,
      });
      return;
    }

    const request = await invoiceService.getInvoice(req.query.id as string);
    res.status(request.status).json({
      message: request.message,
      invoice: request.data,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function updateInvoice(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const exists = await invoiceValidations.exists(req.body.id);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: responses.INVOICE_NOT_FOUND,
      });
      return;
    }

    const request = await invoiceService.updateInvoice(
      req.body,
      req.body.id as string
    );
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function deleteInvoice(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.query.id) {
    res.status(400).json({
      message: responses.REQUIRED_INVOICE_ID,
    });
    return;
  }

  try {
    const exists = await invoiceValidations.exists(req.query.id as string);

    if (exists.error) {
      res.status(500).json({
        message: responses.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: responses.INVOICE_NOT_FOUND,
      });
      return;
    }

    const request = await invoiceService.deleteInvoice(req.query.id as string);
    res.status(request.status).json({
      message: request.message,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}
