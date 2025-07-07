import { Router } from 'express';

import * as User from '@controllers/User.controller';

const router = Router();

router.post('/', User.createUser);
router.get('/', User.readUser);
router.put('/', User.updateUser);
router.delete('/', User.deleteUser);

export default router;
