import { BASE_URL } from '@/app/utils/auth';

export const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const createServiceURL = (endpoint: string) => `${BASE_URL}/${endpoint}`;