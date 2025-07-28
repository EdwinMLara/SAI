import { Router } from 'express';

import * as Auth from '@controllers/Auth.controller';

const router = Router();

router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);
router.post('/refresh', Auth.refreshToken);

export default router;
