import { Router } from 'express';

import * as Auth from '@controllers/Auth.controller';
import Identity, { SessionChecker } from '@middlewares/Auth.middleware';

const router = Router();

router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.get('/refresh', Auth.refreshToken);
router.post('/logout', Auth.logout);
router.get('/session', SessionChecker, Auth.sessionState);
router.post('/forgot-password', Auth.forgotPassword);
router.post('/reset-password', Auth.resetPassword);

export default router;
