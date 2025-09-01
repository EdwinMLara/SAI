import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import * as Product from '@controllers/Product.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.post('/', Auth('user'), Product.createProduct);
router.get('/:key', Auth('user'), Product.getProduct);
router.delete('/:key', Auth('admin'), Product.deleteProduct);
router.post('/replaceAll', Auth('admin'), Product.replaceAllProducts);

export default router;
