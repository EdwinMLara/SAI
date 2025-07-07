import { Router } from 'express';

import productRoutes from './modules/product.routes';
import invoiceRoutes from './modules/invoice.routes';
import documentRoutes from './modules/document.routes';
import ticketRoutes from './modules/ticket.routes';
import userRoutes from './modules/user.routes';

const router = Router();

router.use('/product', productRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/document', documentRoutes);
router.use('/ticket', ticketRoutes);
router.use('/user', userRoutes);

export default router;
