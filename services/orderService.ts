import {
    CreateOrderData,
    Order,
    OrderResponse,
    OrdersResponse,
} from '../types';
import api from './api';

export const orderService = {
    /**
     * Create new order
     */
    createOrder: async (
        data: CreateOrderData
    ): Promise<{ success: boolean; message: string; order: Order }> => {
        const response = await api.post('/orders', data);
        return response.data;
    },

    /**
     * Get order history
     */
    getOrderHistory: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<OrdersResponse> => {
        const response = await api.get<OrdersResponse>('/orders/history', {
            params,
        });
        return response.data;
    },

    /**
     * Get order details
     */
    getOrderDetails: async (orderId: string): Promise<OrderResponse> => {
        const response = await api.get<OrderResponse>(`/orders/${orderId}`);
        return response.data;
    },

    /**
     * Update order status (seller only)
     */
    updateOrderStatus: async (
        orderId: string,
        status: string,
        notes?: string
    ): Promise<{ success: boolean; message: string; order: Order }> => {
        const response = await api.put(`/orders/${orderId}/status`, {
            status,
            notes,
        });
        return response.data;
    },

    /**
     * Cancel order (buyer only)
     */
    cancelOrder: async (
        orderId: string,
        reason?: string
    ): Promise<{ success: boolean; message: string; order: Order }> => {
        const response = await api.put(`/orders/${orderId}/cancel`, { reason });
        return response.data;
    },
};
