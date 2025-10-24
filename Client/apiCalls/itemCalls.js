import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const createItem = async (itemData) => {
    try {
        const response = await api.post('/api/items', itemData);
        return response.data;
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
};

export const getItems = async (params = {}) => {
    try {
        const response = await api.get('/api/items', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting items:', error);
        throw error;
    }
};

export const getItemById = async (id) => {
    try {
        const response = await api.get(`/api/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting item:', error);
        throw error;
    }
};

export const updateItem = async (id, itemData) => {
    try {
        const response = await api.put(`/api/items/${id}`, itemData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

export const deleteItem = async (id) => {
    try {
        const response = await api.delete(`/api/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

export const expressInterest = async (id) => {
    try {
        const response = await api.post(`/api/items/${id}/interest`);
        return response.data;
    } catch (error) {
        console.error('Error expressing interest:', error);
        throw error;
    }
};

export const getUserItems = async (params = {}) => {
    try {
        const response = await api.get('/api/items/user/items', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting user items:', error);
        throw error;
    }
};

export const searchItems = async (searchData) => {
    try {
        const response = await api.post('/api/items/search', searchData);
        return response.data;
    } catch (error) {
        console.error('Error searching items:', error);
        throw error;
    }
};
