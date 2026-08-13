import { Router } from 'express';

import * as Invite from '@controllers/Invite.controller';
import Identity, { Authorize } from '@middlewares/Auth.middleware';

const router = Router();

router.use(Identity, Authorize('admin'));

router.post('/invites', Invite.createInvite);
router.get('/invites', Invite.getInvites);
router.delete('/invites', Invite.removeInvite);

export default router;
