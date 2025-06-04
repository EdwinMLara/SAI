import InvoiceDocument from '../models/Invoice.model';
import logger from '../utils/logger';
import { InvoiceInterface } from '../interfaces/Invoice.interfaces';
import { Request, Response } from 'express';

const createInvoice = async (
  req: Request<{}, {}, InvoiceInterface>,
  res: Response
): Promise<void> => {
  try {
    const requestBody = req.body;

    if (!requestBody.invoice) {
      res.status(400).json({
        status: 400,
        message: 'Bad Request. Invoice data is required.',
      });
      return;
    }

    const existingInvoice = await InvoiceDocument.findOne({
      invoice: requestBody.invoice,
    });

    if (existingInvoice) {
      res.status(409).json({
        status: 409,
        message: 'Invoice already exists.',
      });
      return;
    }

    const newInvoice = new InvoiceDocument(requestBody);
    await newInvoice.save();
    res.status(201).json({
      status: 201,
      message: 'Invoice created successfully.',
    });
  } catch (error) {
    logger.error('Error creating invoice:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error. Could not create invoice.',
    });
  }
};

export default createInvoice;
