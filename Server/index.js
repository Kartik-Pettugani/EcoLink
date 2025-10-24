import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import itemRouter from './routes/item.routes.js';
import messageRouter from './routes/message.routes.js';
import uploadRouter from './routes/upload.routes.js';
import ratingRouter from './routes/rating.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import initializeSocket from './services/socket.js';

dotenv.config();
const app = express();
const server = createServer(app);
const PORT = 8000;

connectDB();

//Middlewares
const allowedOrigins = [
  "http://localhost:5173",              // Local frontend (dev)
  "https://eco-link-6y3u.vercel.app",   // Deployed frontend (prod)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

//Authentication Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/messages', messageRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Initialize Socket.io
const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.io server initialized`);
});