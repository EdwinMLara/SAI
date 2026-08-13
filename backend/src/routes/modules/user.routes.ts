import { Router } from 'express';

import * as User from '@controllers/User.controller';
import Identity, { Authorize } from '@middlewares/Auth.middleware';

const router = Router();

router.get('/list', Identity, Authorize('admin'), User.getAllUsers);
router.put('/', Identity, User.updateUser);

export default router;
