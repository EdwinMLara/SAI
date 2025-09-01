import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import * as User from '@controllers/User.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.patch('/', Auth('user'), User.updateUser);
router.post('role/:role', Auth('user'), User.changeUserRole);

export default router;
