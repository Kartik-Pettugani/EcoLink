import axios from 'axios';
import { API_BASE_URL } from './config.js';

export const getUserStats = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/dashboard/stats`, {
      withCredentials: true
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching dashboard stats';
  }
};