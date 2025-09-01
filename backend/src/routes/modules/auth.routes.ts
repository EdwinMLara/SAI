import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';

import {
   register,
   login,
   sessionRequest,
   logout,
} from '@controllers/Auth.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/session', Auth('user'), sessionRequest);

export default router;
