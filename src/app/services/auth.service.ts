import api from '@/app/utils/axios';
import { BASE_URL } from '../utils/auth';
import type { LoginData, RegisterData, AuthResponse } from '@/app/types/auth';

const AUTH_URL = `${BASE_URL}/auth`;

const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const authService = {
    login: async (data: LoginData) => {
        const response = await api.post<AuthResponse>(
            `${AUTH_URL}/login`, 
            data,
            getHeaders()
        );
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post<AuthResponse>(
            `${AUTH_URL}/register`, 
            data,
            getHeaders()
        );
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};