import { Request, Response } from 'express';

import * as invoiceService from '../services/Invoice.services';
import * as invoiceValidations from './validations/Invoice.validations';

import logger from '../utils/logger';

export async function createInvoice(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const exists = await invoiceValidations.exists(req.body.id as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if invoice exists',
      });
      return;
    }

    if (exists.pass) {
      res.status(409).json({
        message: 'Invoice already exists',
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
      message: 'Internal Server Error',
    });
  }
}

export async function readInvoice(req: Request, res: Response): Promise<void> {
  if (!req.query.id) {
    res.status(400).json({
      message: 'Bad Request. Invoice id is required.',
    });
    return;
  }

  try {
    const exists = await invoiceValidations.exists(req.query.id as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if invoice exists',
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: 'Invoice not found',
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
      message: 'Internal Server Error',
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
        message: 'Internal Server Error. Could not check if invoice exists',
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: 'Invoice does not exist',
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
      message: 'Internal Server Error',
    });
  }
}

export async function deleteInvoice(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.query.id) {
    res.status(400).json({
      message: 'Bad Request. Invoice id is required.',
    });
    return;
  }

  try {
    const exists = await invoiceValidations.exists(req.query.id as string);

    if (exists.error) {
      res.status(500).json({
        message: 'Internal Server Error. Could not check if invoice exists',
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: 'Invoice does not exist',
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
      message: 'Internal Server Error',
    });
  }
}
