import express from 'express';
import {
	getAllBuses,
	getBus,
	getAvailableBuses,
	createBus,
} from '../controllers/bus.js';
import auth from '../middlewares/auth.js';
const router = express.Router();

router.get('/all', auth, getAllBuses);
router.get('/', auth, getAvailableBuses);
router.get('/:id', auth, getBus);
router.post('/', auth, createBus);

export default router;
