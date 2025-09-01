import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import * as Invite from '@controllers/Invite.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.post('/invites', Auth('admin'), Invite.createInvite);
router.get('/invites', Auth('admin'), Invite.getInvites);
router.delete('/invites', Auth('admin'), Invite.removeInvite);

export default router;
