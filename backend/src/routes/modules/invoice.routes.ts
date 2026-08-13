import { Router } from 'express';

import * as Invoice from '@controllers/Invoice.controller';
import Identity from '@middlewares/Auth.middleware';
import FileFilter from '@middlewares/Multer.middleware';

const router = Router();

router.post('/upload', Identity, FileFilter, Invoice.uploadXML);
router.get('/list', Identity, Invoice.getAllInvoices);
router.post('/', Identity, Invoice.createInvoice);
router.get('/', Identity, Invoice.getInvoice);
router.put('/', Identity, Invoice.updateInvoice);
router.delete('/', Identity, Invoice.deleteInvoice);

export default router;
