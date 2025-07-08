import { Router } from 'express';

import { register } from '@controllers/Auth.controller';

const router = Router();

router.post('/', register);

export default router;
