import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import * as User from '@controllers/User.controller';
import FileFilter from '@middlewares/Multer.middleware';
import * as Invite from '@controllers/Invite.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.patch('/', Auth('user'), User.updateUser);
router.patch('/password', Auth('user'), User.changePassword);
router.post('/role', Auth('admin'), User.changeUserRole);
router.patch('/image', Auth('user'), FileFilter, User.changeImage);
router.get('/', Auth('admin'), User.getUsers);
router.post('/invites', Auth('admin'), Invite.createInvite);
router.get('/invites', Auth('admin'), Invite.getInvites);
router.delete('/invites', Auth('admin'), Invite.removeInvite);

export default router;
