import api from '../utils/api';
import { DetailTransaksi } from '../types';
import { BASE_URL } from '@/app/utils/auth';

export const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const createServiceURL = (endpoint: string) => `${BASE_URL}/${endpoint}`;

export const detailTransaksiService = {
  getByTransaksiId: async (transaksiId: string) => {
    const response = await api.get(`/detail-transaksi/transaksi/${transaksiId}`);
    return response.data;
  },

  create: async (detailData: Partial<DetailTransaksi>) => {
    const response = await api.post('/detail-transaksi', detailData);
    return response.data;
  },

  update: async (id: string, detailData: Partial<DetailTransaksi>) => {
    const response = await api.put(`/detail-transaksi/${id}`, detailData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/detail-transaksi/${id}`);
    return response.data;
  }
}; 