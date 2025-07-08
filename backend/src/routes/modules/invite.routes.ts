import { Router } from 'express';
import * as Invite from '@controllers/Invite.controller';

const router = Router();

router.post('/', Invite.createInvite);
router.get('/', Invite.getInvites);
router.delete('/', Invite.removeInvite);

export default router;
