import { Router } from 'express';

import * as Invoice from '@controllers/Invoice.controller';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.post('/', Identity, Invoice.createInvoice);
router.get('/', Identity, Invoice.getInvoice);
router.put('/', Identity, Invoice.updateInvoice);
router.delete('/', Identity, Invoice.deleteInvoice);

export default router;
