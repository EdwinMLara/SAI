import express from 'express';

import * as InvoiceController from '../controllers/Invoice.controller';
import * as ProductController from '../controllers/Product.controller';

import { validateInvoice } from '../middlewares/validators/Invoice.middleware';
import { validateProduct } from '../middlewares/validators/Product.middleware';

const router = express.Router();

router.post('/product/new', validateProduct, ProductController.createProduct);
router.get('/product/get', ProductController.getProduct);
router.put('/product/update', validateProduct, ProductController.updateProduct);
router.delete('/product/delete', ProductController.deleteProduct);

router.post('/invoice/new', validateInvoice, InvoiceController.createInvoice);
router.get('/invoice/get', InvoiceController.getInvoice);
router.put('/invoice/update', validateInvoice, InvoiceController.updateInvoice);
router.delete('/invoice/delete', InvoiceController.deleteInvoice);

export default router;
