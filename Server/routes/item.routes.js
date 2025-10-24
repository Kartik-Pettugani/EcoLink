import express from 'express';
import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
    expressInterest,
    getUserItems,
    searchItems
} from '../controllers/item.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const itemRouter = express.Router();

// Public routes
itemRouter.get('/', getItems);
itemRouter.post('/search', searchItems);

// Protected routes that should come before param routes to avoid shadowing
itemRouter.get('/user/items', isAuth, getUserItems);
itemRouter.post('/', isAuth, createItem);
itemRouter.post('/:id/interest', isAuth, expressInterest);
itemRouter.put('/:id', isAuth, updateItem);
itemRouter.delete('/:id', isAuth, deleteItem);

// Param route (must come after specific routes)
itemRouter.get('/:id', getItemById);

export default itemRouter;
