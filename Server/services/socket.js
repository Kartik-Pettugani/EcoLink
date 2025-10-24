import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

let ioInstance = null;
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    },
    path: '/socket.io'
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      // Extract token from cookies
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        console.log('Socket auth: No cookies provided');
        return next(new Error('No cookies provided'));
      }

      // Parse cookies to find the token
      const tokenMatch = cookies.match(/token=([^;]+)/);
      if (!tokenMatch) {
        console.log('Socket auth: No token found in cookies');
        return next(new Error('No token found in cookies'));
      }

      const token = tokenMatch[1];
      
      // Check if JWT_SECRET is available
      if (!process.env.JWT_SECRET) {
        console.error('Socket auth: JWT_SECRET not configured');
        return next(new Error('Server configuration error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id name userName profilePicture');
      
      if (!user) {
        console.log('Socket auth: User not found for ID:', decoded.id);
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      console.log('Socket auth: User authenticated:', user.name);
      next();
    } catch (err) {
      console.error('Socket authentication error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected with socket ${socket.id}`);

    // Join user to their personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Handle joining a conversation room
    socket.on('conversation:join', async ({ roomId, otherUserId }) => {
      try {
        // Validate required parameters
        if (!roomId) {
          console.log('Missing roomId parameter');
          socket.emit('error', { message: 'roomId is required' });
          return;
        }
        
        // Validate that the user is part of this conversation - format is "room:user1:user2"
        const roomIdParts = roomId.split(':');
        if (roomIdParts.length !== 3 || roomIdParts[0] !== 'room' || !roomIdParts.includes(socket.userId)) {
          socket.emit('error', { message: 'Unauthorized to join this conversation' });
          return;
        }

        socket.join(roomId);
        console.log(`User ${socket.user.name} joined room ${roomId}`);

        // Send conversation history
        const messages = await Message.find({ roomId })
          .populate('from', 'name userName profilePicture')
          .populate('to', 'name userName profilePicture')
          .sort({ createdAt: 1 })
          .limit(50);

        socket.emit('conversation:history', { roomId, messages });
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Error joining conversation' });
      }
    });

    // Handle leaving a conversation room
    socket.on('conversation:leave', ({ roomId }) => {
      if (!roomId) {
        console.log('Missing roomId parameter in conversation:leave');
        socket.emit('error', { message: 'roomId is required' });
        return;
      }
      
      socket.leave(roomId);
      console.log(`User ${socket.user.name} left room ${roomId}`);
    });

    // Handle sending messages
    socket.on('message:send', async ({ roomId, to, text }) => {
      try {
        console.log('Received message send request:', { roomId, to, text, userId: socket.userId });
        
        // Validate required parameters
        if (!roomId || !to || !text) {
          console.log('Missing required parameters:', { roomId, to, text });
          socket.emit('error', { message: 'Missing required parameters: roomId, to, and text are required' });
          return;
        }
        
        // Validate room ID - format is "room:user1:user2"
        const roomIdParts = roomId.split(':');
        console.log('Room ID parts:', roomIdParts);
        
        if (roomIdParts.length !== 3 || roomIdParts[0] !== 'room' || !roomIdParts.includes(socket.userId)) {
          console.log('Room ID validation failed:', { roomIdParts, userId: socket.userId });
          socket.emit('error', { message: 'Unauthorized to send message to this conversation' });
          return;
        }

        // Create message in database
        const message = new Message({
          from: socket.userId,
          to: to,
          text: text.trim(),
          roomId: roomId
        });

        await message.save();
        await message.populate('from', 'name userName profilePicture');
        await message.populate('to', 'name userName profilePicture');

        // Emit message to all users in the room
        io.to(roomId).emit('message:new', { roomId, message });

        // Send notification to recipient if they're not in the room
        const recipientRoom = `user:${to}`;
        socket.to(recipientRoom).emit('message:notification', {
          message,
          from: socket.user
        });

        console.log(`Message sent from ${socket.user.name} to room ${roomId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', ({ roomId, to }) => {
      socket.to(roomId).emit('typing', { roomId, from: socket.userId });
    });

    socket.on('typing:stop', ({ roomId }) => {
      socket.to(roomId).emit('typing:stop', { roomId, from: socket.userId });
    });

    // Handle message read receipts
    socket.on('message:read', async ({ messageId, roomId }) => {
      try {
        if (!messageId || !roomId) {
          socket.emit('error', { message: 'Missing required parameters' });
          return;
        }

        // Validate room access
        const roomIdParts = roomId.split(':');
        if (roomIdParts.length !== 3 || roomIdParts[0] !== 'room' || !roomIdParts.includes(socket.userId)) {
          socket.emit('error', { message: 'Unauthorized to mark message as read' });
          return;
        }

        // Update message as read
        const message = await Message.findById(messageId);
        if (message && message.to.toString() === socket.userId) {
          message.read = true;
          await message.save();

          // Notify sender that message was read
          const senderRoom = `user:${message.from}`;
          socket.to(senderRoom).emit('message:read', {
            messageId,
            readBy: socket.userId,
            readAt: new Date()
          });

          console.log(`Message ${messageId} marked as read by ${socket.userId}`);
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
        socket.emit('error', { message: 'Error marking message as read' });
      }
    });

    // Handle user going online/offline
    socket.on('user:online', () => {
      socket.broadcast.emit('user:status', { 
        userId: socket.userId, 
        status: 'online',
        user: socket.user 
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected`);
      socket.broadcast.emit('user:status', { 
        userId: socket.userId, 
        status: 'offline',
        user: socket.user 
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
  ioInstance = io;

  return io;
};

export default initializeSocket;

// Helper to send a notification to a specific user room from other modules
export const notifyUser = (userId, eventName, payload) => {
  try {
    if (!ioInstance) {
      console.warn('Socket not initialized yet; cannot notify user', userId);
      return;
    }
    const room = `user:${userId}`;
    ioInstance.to(room).emit(eventName, payload);
  } catch (err) {
    console.error('Error notifying user via socket:', err);
  }
};
