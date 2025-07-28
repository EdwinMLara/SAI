import { Router } from 'express';

import * as User from '@controllers/User.controller';

const router = Router();

router.put('/', User.updateUser);

export default router;
