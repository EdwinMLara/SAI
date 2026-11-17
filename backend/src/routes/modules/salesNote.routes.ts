import { Router } from 'express';

import * as SalesNote from '@controllers/SalesNote.controller';
import Identity from '@middlewares/Auth.middleware';
import FileFilter from '@middlewares/Multer.middleware';

const router = Router();

router.get('/list', Identity, SalesNote.getAllSalesNotes);
router.post(
  '/fiscal/xml/parse',
  Identity,
  FileFilter,
  SalesNote.parseFiscalStampXml
);
router.post('/fiscal/xml', Identity, FileFilter, SalesNote.uploadFiscalStampXml);
router.patch('/fiscal', Identity, SalesNote.updateFiscalStamp);
router.post('/', Identity, SalesNote.createSalesNote);
router.get('/', Identity, SalesNote.getSalesNote);
router.put('/', Identity, SalesNote.updateSalesNote);
router.delete('/', Identity, SalesNote.deleteSalesNote);

export default router;
