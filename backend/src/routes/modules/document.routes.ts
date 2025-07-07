import { Router } from 'express';

import * as Document from '@controllers/Document.controller';
import FileFilter from '@middlewares/Multer.middleware';

const router = Router();

router.post('/', FileFilter, Document.createDocumentURL);
router.get('/', Document.readDocumentURL);
router.put('/', FileFilter, Document.updateDocument);
router.delete('/', Document.deleteDocument);

export default router;
