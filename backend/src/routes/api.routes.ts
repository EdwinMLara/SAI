import { Router } from 'express';

import authRoutes from './modules/auth.routes';
import adminRoutes from './modules/admin.routes';
import documentRoutes from './modules/document.routes';
import ticketRoutes from './modules/ticket.routes';
import invoiceRoutes from './modules/user.routes';
import productRoutes from './modules/product.routes';
import userRoutes from './modules/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/documents', documentRoutes);
router.use('/tickets', ticketRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/products', productRoutes);
router.use('/user', userRoutes);

export default router;
