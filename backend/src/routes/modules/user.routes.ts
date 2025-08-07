import { Router } from 'express';

import * as User from '@controllers/User.controller';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.put('/', Identity, User.updateUser);

export default router;
