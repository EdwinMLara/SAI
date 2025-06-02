import express from 'express';
import createProduct from '../controllers/ProductsDB.controller';

const router = express.Router();

router.post('/products', createProduct);

export default router;
