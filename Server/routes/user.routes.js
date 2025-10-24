import express from 'express';
import {
    getCurrentUser,
    updateProfile,
    updateLocation,
    updateEnvironmentalImpact,
    getUserStats
} from '../controllers/user.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const userRouter = express.Router();

userRouter.get('/current', isAuth, getCurrentUser);
userRouter.put('/profile', isAuth, updateProfile);
userRouter.put('/location', isAuth, updateLocation);
userRouter.put('/environmental-impact', isAuth, updateEnvironmentalImpact);
userRouter.get('/stats', isAuth, getUserStats);

export default userRouter;