import express from 'express';

import * as InvoiceController from '@controllers/Invoice.controller';
import * as ProductController from '@controllers/Product.controller';
import * as DocumentController from '@controllers/Document.controller';
import * as TicketController from '@controllers/Ticket.controller';

import * as UserController from '@controllers/User.controller';
import { validateUser } from '@middlewares/validators/User.middleware';

import FileFilter from '@middlewares/Multer.middleware';
import { validateInvoice } from '@middlewares/validators/Invoice.middleware';
import { validateProduct } from '@middlewares/validators/Product.middleware';

const router = express.Router();

router.post('/product/new', validateProduct, ProductController.createProduct);
router.get('/product/get', ProductController.readProduct);
router.put('/product/update', validateProduct, ProductController.updateProduct);
router.delete('/product/delete', ProductController.deleteProduct);

router.post('/invoice/new', validateInvoice, InvoiceController.createInvoice);
router.get('/invoice/get', InvoiceController.readInvoice);
router.put('/invoice/update', validateInvoice, InvoiceController.updateInvoice);
router.delete('/invoice/delete', InvoiceController.deleteInvoice);

router.post(
  '/invoice/document/upload',
  FileFilter,
  DocumentController.createDocumentURL
);
router.get('/invoice/document/get', DocumentController.readDocumentURL);
router.delete('/invoice/document/delete', DocumentController.deleteDocument);
router.put(
  '/invoice/document/update',
  FileFilter,
  DocumentController.updateDocument
);

router.post(
  '/invoice/ticket/upload',
  FileFilter,
  TicketController.createTicketURL
);
router.get('/invoice/ticket/get', TicketController.readTicketURL);
router.put('/invoice/ticket/update', FileFilter, TicketController.updateTicket);
router.delete('/invoice/ticket/delete', TicketController.deleteTicket);

// User routes
router.post('/user/new', validateUser, UserController.createUser);
router.get('/user/get', UserController.readUser);
router.put('/user/update', validateUser, UserController.updateUser);
router.delete('/user/delete', UserController.deleteUser);

export default router;
