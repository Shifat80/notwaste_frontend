import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { LoginData, RegisterData, User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on app start
    const checkAuth = async () => {
        try {
            const response = await authService.getProfile();
            if (response.success && response.user) {
                setUser(response.user);
            }
        } catch (error) {
            console.log('Not authenticated');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (data: LoginData) => {
        const response = await authService.login(data);
        if (response.success && response.user) {
            setUser(response.user);
        } else {
            throw new Error(response.message || 'Login failed');
        }
    };

    const register = async (data: RegisterData) => {
        const response = await authService.register(data);
        if (response.success && response.user) {
            setUser(response.user);
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, checkAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
