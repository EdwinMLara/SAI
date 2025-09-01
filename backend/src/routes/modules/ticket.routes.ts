import { Router } from 'express';

import Auth from '@middlewares/Auth.middleware';
import FileFilter from '@middlewares/Multer.middleware';
import * as Ticket from '@controllers/Ticket.controller';

/* ------------------ Code ------------------ */

const router = Router();

router.post('/:ticketId', Auth('user'), FileFilter, Ticket.uploadFile);
router.get('/:ticketId', Auth('user'), Ticket.readTicketURL);
router.put('/:ticketId', Auth('user'), FileFilter, Ticket.updateTicket);
router.delete('/:ticketId', Auth('user'), Ticket.deleteTicket);

export default router;
