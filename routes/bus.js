import express from 'express';
import {
	getAllBuses,
	getBus,
	searchBuses,
	createBus,
	updateBus,
	updateBusWithNotification,
	deleteBus,
} from '../controllers/bus.js';
import auth from '../middlewares/auth.js';
const router = express.Router();

router.get('/', auth, getAllBuses);
router.get('/search', searchBuses);
router.get('/:id', auth, getBus);
router.post('/', auth, createBus);
router.patch('/:id', auth, updateBusWithNotification);
router.put('/', auth, updateBus);
router.delete('/:id', auth, deleteBus);

export default router;
