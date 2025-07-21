import { Request, Response, NextFunction } from 'express';

import * as documentService from '@services/Document.services';
import * as documentValidations from '@controllers/validations/Document.validations';
import * as invoiceValidations from '@controllers/validations/Invoice.validations';

import responses from '@utils/responses';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function createDocumentURL(
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.file) {
    res.status(400).json({
      message: responses.REQUIRED_FILE,
    });
    return;
  }

  if (req.file.mimetype !== 'application/pdf') {
    res.status(415).json({
      message: responses.INVALID_FILETYPE,
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
        message: responses.DOCUMENT_ALREADY_ATTACHED,
      });
      return;
    }

    const generate = await documentService.generateURL(req.file!, filename);

    res.status(200).json({
      message: responses.DOCUMENT_URL_GENERATED,
      url: generate.url,
    });
  } catch (error) {
    next(error);
  }
}

export async function readDocumentURL(
  req: Request,
  res: Response,
  next: NextFunction
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
        message: responses.DOCUMENT_NOT_FOUND,
      });
      return;
    }

    const request = await documentService.searchURL(filename);
    res
      .status(200)
      .json({ message: responses.DOCUMENT_FOUND, url: request.url });
  } catch (error) {
    next(error);
  }
}

export async function updateDocument(
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    res.status(415).json({
      message: responses.INVALID_FILETYPE,
    });
    return;
  }

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
        message: responses.DOCUMENT_NOT_FOUND,
      });
      return;
    }

    const request = await documentService.updateFile(req.file!, filename);
    res
      .status(200)
      .json({ message: responses.DOCUMENT_UPDATED, url: request.url });
  } catch (error) {
    next(error);
  }
}

export async function deleteDocument(
  req: Request,
  res: Response,
  next: NextFunction
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
        message: responses.DOCUMENT_NOT_FOUND,
      });
      return;
    }

    await documentService.deleteFile(filename);
    res.status(200).json({ message: responses.DOCUMENT_DELETED });
  } catch (error) {
    next(error);
  }
}
