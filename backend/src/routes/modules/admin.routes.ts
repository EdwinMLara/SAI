import { Router } from 'express';

import * as Invite from '@controllers/Invite.controller';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.post('/invites', Identity, Invite.createInvite);
router.get('/invites', Identity, Invite.getInvites);
router.delete('/invites', Identity, Invite.removeInvite);

export default router;
