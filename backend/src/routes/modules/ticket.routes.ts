import { Router } from 'express';

import * as Ticket from '@controllers/Ticket.controller';
import FileFilter from '@middlewares/Multer.middleware';

const router = Router();

router.post('/', FileFilter, Ticket.uploadFile);
router.get('/', Ticket.readTicketURL);
router.put('/', FileFilter, Ticket.updateTicket);
router.delete('/', Ticket.deleteTicket);

export default router;
