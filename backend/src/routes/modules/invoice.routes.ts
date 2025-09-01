import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import * as Invoice from '@controllers/Invoice.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.post('/', Auth('user'), Invoice.createInvoice);
router.get('/:id', Auth('user'), Invoice.getInvoice);
router.put('/:id', Auth('user'), Invoice.updateInvoice);
router.delete('/:id', Auth('user'), Invoice.deleteInvoice);

export default router;
