import express from 'express';
import {
	getTickets,
	getTicket,
	bookTicket,
	cancelTicket,
} from '../controllers/ticket.js';
import auth from '../middlewares/auth.js';
const router = express.Router();

router.get('/', auth, getTickets);
router.get('/', auth, getTicket);
router.post('/', auth, bookTicket);
router.post('/', auth, cancelTicket);

export default router;
