import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if we are already on the login page or if the error came from a login attempt
            const isLoginRequest = error.config.url.includes('/login');

            if (!isLoginRequest) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
