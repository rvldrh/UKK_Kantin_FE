import type { User } from '../types';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const BASE_URL = 'http://localhost:5000';

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}; 

export const handleForbiddenError = (error: any) => {
  if (error.response?.status === 403) {
      window.location.href = '/pages/403'; // Redirect ke halaman 403
  }
  throw error;
};

export const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
      alert('Session expired. Please login again.');
  
      localStorage.setItem('isLoginn', 'false');
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      
      window.location.href = '/pages/login';
  }
  throw error;
}