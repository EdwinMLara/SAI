import { Router } from 'express';

import * as Document from '@controllers/Document.controller';
import FileFilter from '@middlewares/Multer.middleware';

import Auth from '@middlewares/Auth.middleware';

/* ------------------ Code ------------------ */

const router = Router();

// Rutas con parámetro invoiceId
router.post('/:invoiceId', Auth('user'), FileFilter, Document.uploadFile);
router.get('/:invoiceId', Auth('user'), Document.readDocumentURL);
router.put('/:invoiceId', Auth('user'), FileFilter, Document.updateDocument);
router.delete('/:invoiceId', Auth('user'), Document.deleteDocument);

export default router;
