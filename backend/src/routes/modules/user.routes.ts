import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import * as User from '@controllers/User.controller';
import * as Invite from '@controllers/Invite.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.patch('/', Auth('user'), User.updateUser);
router.post('role/:role', Auth('user'), User.changeUserRole);
router.post('/invites', Auth('admin'), Invite.createInvite);
router.get('/invites', Auth('admin'), Invite.getInvites);
router.delete('/invites', Auth('admin'), Invite.removeInvite);

export default router;
