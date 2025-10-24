import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/api/user/current');
        return response.data;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/api/user/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const updateLocation = async (locationData) => {
    try {
        const response = await api.put('/api/user/location', locationData);
        return response.data;
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
};

export const updateEnvironmentalImpact = async (impactData) => {
    try {
        const response = await api.put('/api/user/environmental-impact', impactData);
        return response.data;
    } catch (error) {
        console.error('Error updating environmental impact:', error);
        throw error;
    }
};

export const getUserStats = async () => {
    try {
        const response = await api.get('/api/user/stats');
        return response.data;
    } catch (error) {
        console.error('Error getting user stats:', error);
        throw error;
    }
};
