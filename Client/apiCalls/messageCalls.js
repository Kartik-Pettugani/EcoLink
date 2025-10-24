import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

export const getConversationWith = async (userId) => {
  const res = await api.get(`/api/messages/with/${userId}`);
  return res.data;
};

export const sendMessage = async ({ to, text }) => {
  const res = await api.post(`/api/messages/send`, { to, text });
  return res.data;
};

export const getConversations = async () => {
  const res = await api.get(`/api/messages/conversations`);
  return res.data;
};
