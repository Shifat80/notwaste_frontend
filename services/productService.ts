import {
    CreateProductData,
    Product,
    ProductFilters,
    ProductResponse,
    ProductsResponse,
} from '../types';
import api from './api';

export const productService = {
    /**
     * Get all products with filters
     */
    getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
        const response = await api.get<ProductsResponse>('/products', {
            params: filters,
        });
        return response.data;
    },

    /**
     * Get single product by ID
     */
    getProduct: async (id: string): Promise<ProductResponse> => {
        const response = await api.get<ProductResponse>(`/products/${id}`);
        return response.data;
    },

    /**
     * Create new product
     */
    createProduct: async (
        data: CreateProductData
    ): Promise<{ success: boolean; message: string; product: Product }> => {
        const response = await api.post('/products', data);
        return response.data;
    },

    /**
     * Update product
     */
    updateProduct: async (
        id: string,
        data: Partial<CreateProductData>
    ): Promise<{ success: boolean; message: string; product: Product }> => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    /**
     * Delete product
     */
    deleteProduct: async (
        id: string
    ): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};
