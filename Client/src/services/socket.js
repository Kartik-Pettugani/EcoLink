import { io } from 'socket.io-client';
import { SOCKET_BASE_URL, SOCKET_PATH, SOCKET_WITH_CREDENTIALS } from '../../apiCalls/config.js';

let socket;

export const getSocket = () => {
  if (socket && socket.connected) return socket;
  if (!socket) {
    socket = io(SOCKET_BASE_URL, {
      path: SOCKET_PATH,
      withCredentials: SOCKET_WITH_CREDENTIALS,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: {
        // The token will be sent via cookies with withCredentials: true
        // The server will extract it from the cookie
      }
    });

    // Enhanced error handling
    socket.on('connect_error', (err) => {
      // Handle connection error silently
    });

    socket.on('connect', () => {
      // Connection established
    });

    socket.on('disconnect', (reason) => {
      // Handle disconnection
    });

    socket.on('error', (err) => {
      // Handle socket error silently
    });
  } else if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
