import { Router } from 'express';

import * as Invite from '@controllers/Invite.controller';

const router = Router();

router.post('/invites', Invite.createInvite);
router.get('/invites', Invite.getInvites);
router.delete('/invites', Invite.removeInvite);

export default router;
