// indora_frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// --- THE FIX: ADD THIS INTERCEPTOR ---
api.interceptors.request.use((config) => {
    // 1. Get the token we saved during login
    const token = localStorage.getItem('access_token'); 
    
    // 2. If it exists, add it to the Authorization header
    if (token) {
        // Crucial: There must be a space after 'Bearer'
        config.headers.Authorization = `Bearer ${token}`; 
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;