import { Router } from 'express';

import * as Product from '@controllers/Product.controller';

const router = Router();

router.post('/', Product.createProduct);
router.get('/', Product.readProduct);
router.put('/', Product.updateProduct);
router.delete('/', Product.deleteProduct);

export default router;
