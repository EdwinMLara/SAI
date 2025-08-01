import { Router } from 'express';

import * as Product from '@controllers/Product.controller';

const router = Router();

router.post('/', Product.createProduct);
router.get('/', Product.getProduct);
router.delete('/', Product.deleteProduct);

export default router;
