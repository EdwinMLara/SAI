import { Request, Response } from 'express';

import * as ticketService from '@services/Ticket.services';
import * as ticketValidations from '@controllers/validations/Ticket.validations';
import * as invoiceValidations from '@controllers/validations/Invoice.validations';

import logger from '@utils/logger';
import responses from '@utils/responses';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function createTicketURL(
  req: MulterRequest,
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

    if (checking) {
      res.status(409).json({
        message: responses.TICKET_ALREADY_ATTACHED,
      });
      return;
    }

    const generate = await ticketService.generateURL(req.file!, filename);

    res.status(200).json({
      message: responses.TICKET_URL_GENERATED,
      url: generate.url,
    });
  } catch (error) {
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
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
        message: responses.TICKET_NOT_FOUND,
      });
      return;
    }

    const request = await ticketService.searchURL(filename);
    res.status(200).json({ message: responses.TICKET_FOUND, url: request.url });
  } catch (error) {
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function updateTicket(
  req: MulterRequest,
  res: Response
): Promise<void> {
  if (!req.file || req.file.mimetype !== 'image/jpeg') {
    res.status(415).json({
      message: responses.INVALID_FILETYPE,
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
        message: responses.TICKET_NOT_FOUND,
      });
      return;
    }

    const request = await ticketService.updateFile(req.file!, filename);
    res
      .status(200)
      .json({ message: responses.TICKET_UPDATED, url: request.url });
  } catch (error) {
    logger.error('Ticket creation failed', error);

    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
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
        message: responses.TICKET_NOT_FOUND,
      });
      return;
    }

    await ticketService.deleteFile(filename);
    res.status(200).json({ message: responses.TICKET_DELETED });
  } catch (error) {
    logger.error('Get tickets failed', error);
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
  }
}
