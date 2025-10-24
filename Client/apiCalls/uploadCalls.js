import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

export const uploadImages = async (files) => {
  const formData = new FormData();
  
  // Add each file to FormData
  files.forEach((file, index) => {
    formData.append('images', file);
  });

  const res = await api.post('/api/upload/images', formData, {
    // Let the browser set the Content-Type including the boundary
  });
  return res.data;
};

export const deleteImage = async (publicId) => {
  const res = await api.delete(`/api/upload/images/${publicId}`);
  return res.data;
};
