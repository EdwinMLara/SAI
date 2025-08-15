import { Router } from 'express';

import * as Product from '@controllers/Product.controller';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.post('/', Identity, Product.createProduct);
router.get('/', Identity, Product.getProduct);
router.delete('/', Identity, Product.deleteProduct);
router.post('/replaceAll', Identity, Product.replaceAllProducts);
router.get('/lastUpdate', Identity, Product.getLastUpdate);

export default router;
