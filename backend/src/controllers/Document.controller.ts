import { Request, Response } from 'express';

import * as documentService from '../services/Document.services';
import * as documentValidations from './validations/Document.validations';
import * as invoiceValidations from './validations/Invoice.validations';

import logger from '../utils/logger';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function createDocumentURL(
  req: MulterRequest,
  res: Response
): Promise<void> {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    res.status(415).json({
      message: 'The request does not contain the required file type.',
    });
    return;
  }

  try {
    const validate = await documentValidations.integrity(
      req.query.id as string
    );

    if (validate.error) {
      res.status(400).json({ message: validate.message });
      return;
    }

    if (!validate.pass) {
      res.status(404).json({ message: validate.message });
      return;
    }

    const id = req.query.id;
    const filename = `document_${id}.pdf`;

    const checking = await documentService.search(filename);

    if (checking) {
      res.status(409).json({
        message: 'The invoice already contains a stored document',
      });
      return;
    }

    const generate = await documentService.generateURL(req.file, filename);

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

export async function readDocumentURL(
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
        message: exists.message,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: exists.message,
      });
      return;
    }

    const id = req.query.id;
    const filename = `document_${id}.pdf`;

    const checking = await documentService.search(filename);

    if (!checking) {
      res.status(404).json({
        message: 'The document does not exist.',
      });
      return;
    }

    const request = await documentService.searchURL(filename);
    res.status(200).json({ message: 'URL found', url: request.url });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export async function updateDocument(
  req: MulterRequest,
  res: Response
): Promise<void> {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    res.status(415).json({
      message: 'The request does not contain the required file type.',
    });
    return;
  }

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
        message: exists.message,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: exists.message,
      });
      return;
    }

    const id = req.query.id;
    const filename = `document_${id}.pdf`;

    const checking = await documentService.search(filename);

    if (!checking) {
      res.status(404).json({
        message: 'The document does not exist.',
      });
      return;
    }

    const request = await documentService.updateFile(req.file, filename);
    res
      .status(200)
      .json({ message: 'Document successfully updated', url: request.url });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export async function deleteDocument(
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
        message: exists.message,
      });
      return;
    }

    if (!exists.pass) {
      res.status(404).json({
        message: exists.message,
      });
      return;
    }

    const id = req.query.id;
    const filename = `document_${id}.pdf`;

    const checking = await documentService.search(filename);

    if (!checking) {
      res.status(404).json({
        message: 'The document does not exist.',
      });
      return;
    }

    await documentService.deleteFile(filename);
    res.status(200).json({ message: 'Document successfully deleted' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}
