import { API_URL } from './config';
import api from './api';

export const uploadFile = async (file: File, path: string = 'uploads'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`${API_URL}/${path}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

export const getImageUrl = (path: string | null): string => {
  if (!path) return '/images/default.png';
  if (path.startsWith('http')) return path;
  return `${API_URL}/uploads/${path}`;
}; 