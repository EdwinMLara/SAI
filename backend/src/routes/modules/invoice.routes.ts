import { Router } from 'express';

import * as Invoice from '@controllers/Invoice.controller';

const router = Router();

router.post('/', Invoice.createInvoice);
router.get('/', Invoice.readInvoice);
router.put('/', Invoice.updateInvoice);
router.delete('/', Invoice.deleteInvoice);

export default router;
