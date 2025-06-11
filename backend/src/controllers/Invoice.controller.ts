import { Request, Response } from 'express';
import { InvoiceInterface } from '../interfaces/Invoice.interfaces';
import * as invoiceService from '../services/Invoice.services';
import logger from '../utils/logger';

export async function createInvoice(
  req: Request<{}, {}, InvoiceInterface>,
  res: Response
): Promise<void> {
  try {
    const result = await invoiceService.createInvoice(req.body);
    res.statusMessage = result.message;
    res.status(result.status).json();
  } catch (error) {
    logger.error('Error creating invoice:', error);
    res.statusMessage = 'Internal Server Error. Could not create invoice.';
    res.status(500);
  }
}

export async function getInvoice(
  req: Request,
  res: Response<{}, InvoiceInterface>
): Promise<void> {
  try {
    const result = await invoiceService.getInvoice(req.query.invoice as string);
    res.statusMessage = result.message;
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Error retrieving invoice:', error);
    res.statusMessage = 'Internal Server Error. Could not retrieve invoice.';
    res.status(500);
  }
}

export async function updateInvoice(
  req: Request<{}, {}, InvoiceInterface>,
  res: Response
): Promise<void> {
  if (!req.query.invoice) {
    res.statusMessage = 'Bad Request. Invoice ID is required.';
    res.status(400);
    return;
  }

  try {
    const result = await invoiceService.updateInvoice(
      req.body,
      req.query.invoice as string
    );

    res.statusMessage = result.message;
    res.status(result.status).json();
  } catch (error) {
    logger.error('Error updating invoice:', error);
    res.statusMessage = 'Internal Server Error. Could not update invoice.';
    res.status(500);
  }
}

export async function deleteInvoice(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.query.invoice) {
    res.statusMessage = 'Bad Request. Invoice ID is required.';
    res.status(400);
    return;
  }

  try {
    const result = await invoiceService.deleteInvoice(
      req.query.invoice as string
    );
    res.statusMessage = result.message;
    res.status(result.status).json();
  } catch (error) {
    logger.error('Error deleting invoice:', error);
    res.statusMessage = 'Internal Server Error. Could not delete invoice.';
    res.status(500);
  }
}
