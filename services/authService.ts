import {
    AuthResponse,
    ChangePasswordData,
    LoginData,
    RegisterData,
    UpdateProfileData,
    User,
} from '../types';
import api from './api';

export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Login user
     */
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<{ success: boolean; message: string }> => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<{ success: boolean; user: User }> => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (
        data: UpdateProfileData
    ): Promise<{ success: boolean; message: string; user: User }> => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (
        data: ChangePasswordData
    ): Promise<{ success: boolean; message: string }> => {
        const response = await api.put('/users/change-password', data);
        return response.data;
    },

    /**
     * Get user's own listings
     */
    getMyListings: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<any> => {
        const response = await api.get('/users/my-listings', { params });
        return response.data;
    },
};
