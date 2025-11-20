// User Types
export interface User {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt: string;
}

// Product Types
export interface Product {
    _id: string;
    name: string;
    title: string;
    description: string;
    price: number;
    status: 'available' | 'pending' | 'sold';
    location: string;
    category: string;
    imageUri: string;
    sellerId: string;
    sellerName?: string;
    sellerEmail?: string;
    createdAt: string;
    updatedAt: string;
}

// Category Types
export interface Category {
    _id: string;
    name: string;
    icon: string;
    productCount: number;
}

// Order Types
export interface Order {
    _id: string;
    orderNumber: string;
    productId: string;
    productName?: string;
    productImage?: string;
    sellerId: string;
    sellerName?: string;
    sellerEmail?: string;
    buyerId: string;
    buyerName?: string;
    buyerEmail?: string;
    quantity: number;
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
    notes?: string;
    date?: string;
    items?: number;
    createdAt: string;
    updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
}

export interface ProductsResponse {
    success: boolean;
    products: Product[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface ProductResponse {
    success: boolean;
    product: Product;
}

export interface CategoriesResponse {
    success: boolean;
    categories: Category[];
}

export interface OrdersResponse {
    success: boolean;
    orders: Order[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface OrderResponse {
    success: boolean;
    order: Order;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

// Product Filters
export interface ProductFilters {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: 'available' | 'pending' | 'sold';
    location?: string;
    minPrice?: number;
    maxPrice?: number;
}

// Form Data Types
export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface CreateProductData {
    name?: string;
    title: string;
    description: string;
    price?: number;
    location: string;
    status?: 'available' | 'pending' | 'sold';
    category: string;
    imageUri: string;
}

export interface UpdateProfileData {
    username?: string;
    avatar?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface CreateOrderData {
    productId: string;
    quantity: number;
    buyerMessage?: string;
    paymentMethod: string;
}
