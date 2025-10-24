import express from 'express';
import { getUserStats } from '../controllers/dashboard.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/stats', isAuth, getUserStats);

export default router;