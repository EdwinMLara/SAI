import express from 'express';
import createProduct from '../controllers/ProductsDB.controller';
import createInvoice from '../controllers/Invoice.controller';

const router = express.Router();

router.post('/products', createProduct);
router.post('/invoice/new', createInvoice);

export default router;
