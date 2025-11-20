import { CategoriesResponse } from '../types';
import api from './api';

export const categoryService = {
    /**
     * Get all categories
     */
    getCategories: async (): Promise<CategoriesResponse> => {
        const response = await api.get<CategoriesResponse>('/categories');
        return response.data;
    },
};
