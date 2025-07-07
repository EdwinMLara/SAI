import { Router } from 'express';

import { login } from '@controllers/Auth.controller';

const router = Router();

router.post('/', login);

export default router;
