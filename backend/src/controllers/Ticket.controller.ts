import { Request, Response } from 'express';

import * as ticketService from '@services/Ticket.services';
import * as ticketValidations from '@controllers/validations/Ticket.validations';
import * as invoiceValidations from '@controllers/validations/Invoice.validations';

import logger from '@utils/logger';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function createTicketURL(
  req: MulterRequest,
  res: Response
): Promise<void> {
  if (!req.file || req.file.mimetype !== 'image/jpeg') {
    res.status(415).json({
      message: 'The request does not contain the required file type.',
    });
    return;
  }

  try {
    const validate = await ticketValidations.integrity(
      req.query.id as string,
      req.query.transaction as string
    );

    if (validate.error) {
      res.status(400).json({ message: validate.message });
      return;
    }

    if (!validate.pass) {
      res.status(404).json({ message: validate.message });
      return;
    }

    const payment = await invoiceValidations.transaction(
      req.query.id as string,
      req.query.transaction as string
    );

    if (payment.error) {
      res.status(400).json({ message: payment.message });
      return;
    }

    if (!payment.pass) {
      res.status(404).json({ message: payment.message });
      return;
    }

    const id = req.query.id;
    const transaction = req.query.transaction;
    const filename = `ticket_${id}_${transaction}.jpeg`;

    const checking = await ticketService.search(filename);

    if (checking) {
      res.status(409).json({
        message: 'The invoice already contains a stored ticket',
      });
      return;
    }

    const generate = await ticketService.generateURL(req.file, filename);

    res.status(200).json({
      message: 'The url was successfully generated',
      url: generate.url,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export async function readTicketURL(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validate = await ticketValidations.integrity(
      req.query.id as string,
      req.query.transaction as string
    );

    if (validate.error) {
      res.status(400).json({ message: validate.message });
      return;
    }

    if (!validate.pass) {
      res.status(404).json({ message: validate.message });
      return;
    }

    const payment = await invoiceValidations.transaction(
      req.query.id as string,
      req.query.transaction as string
    );

    if (payment.error) {
      res.status(400).json({ message: payment.message });
      return;
    }

    if (!payment.pass) {
      res.status(404).json({ message: payment.message });
      return;
    }

    const id = req.query.id;
    const transaction = req.query.transaction;
    const filename = `ticket_${id}_${transaction}.jpeg`;

    const checking = await ticketService.search(filename);

    if (!checking) {
      res.status(404).json({
        message: 'The ticket does not exist.',
      });
      return;
    }

    const request = await ticketService.searchURL(filename);
    res.status(200).json({ message: 'URL found', url: request.url });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export async function updateTicket(
  req: MulterRequest,
  res: Response
): Promise<void> {
  if (!req.file || req.file.mimetype !== 'image/jpeg') {
    res.status(415).json({
      message: 'The request does not contain the required file type.',
    });
    return;
  }
  try {
    const validate = await ticketValidations.integrity(
      req.query.id as string,
      req.query.transaction as string
    );

    if (validate.error) {
      res.status(400).json({ message: validate.message });
      return;
    }

    if (!validate.pass) {
      res.status(404).json({ message: validate.message });
      return;
    }

    const payment = await invoiceValidations.transaction(
      req.query.id as string,
      req.query.transaction as string
    );

    if (payment.error) {
      res.status(400).json({ message: payment.message });
      return;
    }

    if (!payment.pass) {
      res.status(404).json({ message: payment.message });
      return;
    }

    const id = req.query.id;
    const transaction = req.query.transaction;
    const filename = `ticket_${id}_${transaction}.jpeg`;

    const checking = await ticketService.search(filename);

    if (!checking) {
      res.status(404).json({
        message: 'The ticket does not exist.',
      });
      return;
    }

    const request = await ticketService.updateFile(req.file, filename);
    res
      .status(200)
      .json({ message: 'Ticket successfully updated', url: request.url });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export async function deleteTicket(req: Request, res: Response): Promise<void> {
  try {
    const validate = await ticketValidations.integrity(
      req.query.id as string,
      req.query.transaction as string
    );

    if (validate.error) {
      res.status(400).json({ message: validate.message });
      return;
    }

    if (!validate.pass) {
      res.status(404).json({ message: validate.message });
      return;
    }

    const payment = await invoiceValidations.transaction(
      req.query.id as string,
      req.query.transaction as string
    );

    if (payment.error) {
      res.status(400).json({ message: payment.message });
      return;
    }

    if (!payment.pass) {
      res.status(404).json({ message: payment.message });
      return;
    }

    const id = req.query.id;
    const transaction = req.query.transaction;
    const filename = `ticket_${id}_${transaction}.jpeg`;

    const checking = await ticketService.search(filename);

    if (!checking) {
      res.status(404).json({
        message: 'The ticket does not exist.',
      });
      return;
    }

    await ticketService.deleteFile(filename);
    res.status(200).json({ message: 'Ticket successfully deleted' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}
