// config.js

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://eco-link-backend.onrender.com"; // <-- replace with your deployed backend URL

export const SOCKET_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SOCKET_URL) ||
  API_BASE_URL;

export const SOCKET_PATH =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SOCKET_PATH) ||
  "/socket.io";

export const SOCKET_WITH_CREDENTIALS =
  ((typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_SOCKET_WITH_CREDENTIALS) ??
    "true") === "true";
