import { Router } from 'express';

import * as Document from '@controllers/Document.controller';
import FileFilter from '@middlewares/Multer.middleware';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.post('/', Identity, FileFilter, Document.uploadFile);
router.get('/', Identity, Document.readDocumentURL);
router.put('/', Identity, FileFilter, Document.updateDocument);
router.delete('/', Identity, Document.deleteDocument);

export default router;
