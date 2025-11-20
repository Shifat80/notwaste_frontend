import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    // IMPORTANT: This enables sending cookies with requests
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add authentication tokens here if needed
        // const token = await AsyncStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            // Server responded with error status
            const data = error.response.data as any;
            console.error('API Error:', data.message || error.message);

            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized - maybe redirect to login
                console.log('Unauthorized - User needs to login');
            }

            return Promise.reject(data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
            return Promise.reject({
                success: false,
                message: 'Network error. Please check your connection.',
            });
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject({
                success: false,
                message: error.message,
            });
        }
    }
);

export default api;
