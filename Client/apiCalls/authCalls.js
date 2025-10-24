import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});


export const signUpUser = async(userData)=>{
    try{
        const response = await api.post('/api/auth/signup',userData);
        return response.data;
    }catch(error){
        console.error('Error signing up:', error);
        throw error;
    }
}
export const signInUser = async(userData)=>{
    try{
        const response = await api.post('/api/auth/signin',userData);
        return response.data;
    }catch(error){
        console.error('Error signing in:', error);
        throw error;
    }
}

export const signOutUser = async() => {
    try {
        const response = await api.post('/api/auth/signout');
        return response.data;
    } catch(error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

export const requestPasswordReset = async (email) => {
    try {
        const response = await api.post('/api/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error);
        throw error;
    }
}