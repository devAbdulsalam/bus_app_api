import express from 'express';
import {
	confrimTransaction,
	createPayment,
	getPayments,
	getPayment,
} from '../controllers/payment.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
router.get('/', auth, getPayments);
router.get('/:id', auth, getPayment);
router.post('/', auth, createPayment);
router.post('/', auth, confrimTransaction);
export default router;
