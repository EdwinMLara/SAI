import express from 'express';
import createProduct from '../controllers/ProductsDB.controller';
import createInvoice from '../controllers/Invoice.controller';
import getProduct from '../controllers/Product.controller';
import saveDocument from '../controllers/Document.controller';

const router = express.Router();

router.post('/products', createProduct);
router.post('/invoice/new', createInvoice);
router.post('/get-product', getProduct);
router.post('/document', saveDocument);

export default router;
