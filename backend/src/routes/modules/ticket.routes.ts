import { Router } from 'express';

import * as Ticket from '@controllers/Ticket.controller';
import FileFilter from '@middlewares/Multer.middleware';
import Identity from '@middlewares/Auth.middleware';

const router = Router();

router.post('/', Identity, FileFilter, Ticket.uploadFile);
router.get('/', Identity, Ticket.readTicketURL);
router.put('/', Identity, FileFilter, Ticket.updateTicket);
router.delete('/', Identity, Ticket.deleteTicket);

export default router;
