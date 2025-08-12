import { Router } from 'express';

import * as Auth from '@controllers/Auth.controller';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.get('/refresh', Identity, Auth.refreshToken);
router.post('/logout', Auth.logout);
router.get('/session', Identity, Auth.sessionState);

export default router;
