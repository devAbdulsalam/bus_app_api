import express from 'express';
import { create } from '../controllers/payment.js';
// import auth from '../middlewares/auth.js';
const router = express.Router();
router.post('/', create);
export default router;
