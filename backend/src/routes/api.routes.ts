import { Router } from 'express';

import loginRoutes from './modules/login.routes';
import productRoutes from './modules/product.routes';
import invoiceRoutes from './modules/invoice.routes';
import documentRoutes from './modules/document.routes';
import ticketRoutes from './modules/ticket.routes';
import userRoutes from './modules/user.routes';
import inviteRoutes from './modules/invite.routes';

const router = Router();

router.use('/login', loginRoutes);
router.use('/product', productRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/document', documentRoutes);
router.use('/ticket', ticketRoutes);
router.use('/user', userRoutes);
router.use('/invite', inviteRoutes);

export default router;
