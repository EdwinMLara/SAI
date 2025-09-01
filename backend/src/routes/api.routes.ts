/**
 * Main API router configuration
 * Aggregates all route modules and defines the API endpoint structure
 * Provides a centralized routing configuration for the entire application
 */

import { Router } from 'express';

import authRoutes from './modules/auth.routes';
import documentRoutes from './modules/document.routes';
import ticketRoutes from './modules/ticket.routes';
import invoiceRoutes from './modules/invoice.routes';
import productRoutes from './modules/product.routes';
import userRoutes from './modules/user.routes';

const router = Router();

/**
 * API route definitions
 * Each route group handles a specific domain of the application
 */
router.use('/auth', authRoutes); // Authentication and authorization
router.use('/documents', documentRoutes); // Document file management
router.use('/tickets', ticketRoutes); // Ticket file management
router.use('/invoices', invoiceRoutes); // Invoice management
router.use('/products', productRoutes); // Product catalog management
router.use('/user', userRoutes); // User profile management

export default router;
