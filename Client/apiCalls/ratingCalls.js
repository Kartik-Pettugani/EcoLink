import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const createRating = async (ratingData) => {
    try {
        const response = await api.post('/api/ratings', ratingData);
        return response.data;
    } catch (error) {
        console.error('Error creating rating:', error);
        throw error;
    }
};

export const getUserRatings = async (userId, params = {}) => {
    try {
        const response = await api.get(`/api/ratings/user/${userId}`, { params });
        return response.data;
    } catch (error) {
        console.error('Error getting user ratings:', error);
        throw error;
    }
};

export const getMyRatings = async (params = {}) => {
    try {
        const response = await api.get('/api/ratings/my-ratings', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting my ratings:', error);
        throw error;
    }
};

export const updateRating = async (ratingId, ratingData) => {
    try {
        const response = await api.put(`/api/ratings/${ratingId}`, ratingData);
        return response.data;
    } catch (error) {
        console.error('Error updating rating:', error);
        throw error;
    }
};

export const deleteRating = async (ratingId) => {
    try {
        const response = await api.delete(`/api/ratings/${ratingId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting rating:', error);
        throw error;
    }
};
