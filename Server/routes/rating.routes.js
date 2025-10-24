import express from 'express';
import {
    createRating,
    getUserRatings,
    getMyRatings,
    updateRating,
    deleteRating
} from '../controllers/rating.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const ratingRouter = express.Router();

// All rating routes require authentication
ratingRouter.post('/', isAuth, createRating);
ratingRouter.get('/user/:userId', getUserRatings);
ratingRouter.get('/my-ratings', isAuth, getMyRatings);
ratingRouter.put('/:ratingId', isAuth, updateRating);
ratingRouter.delete('/:ratingId', isAuth, deleteRating);

export default ratingRouter;
