import express from 'express';
import {
    getConversationWith,
    sendMessage,
    getConversations,
    markMessagesAsRead
} from '../controllers/message.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const messageRouter = express.Router();

// All message routes require authentication
messageRouter.use(isAuth);

// Get conversation with a specific user
messageRouter.get('/with/:userId', getConversationWith);

// Send a message
messageRouter.post('/send', sendMessage);

// Get all conversations for the current user
messageRouter.get('/conversations', getConversations);

// Mark messages as read
messageRouter.put('/read/:otherUserId', markMessagesAsRead);

export default messageRouter;
