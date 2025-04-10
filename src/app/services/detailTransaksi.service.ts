import api from '../utils/api';
import { DetailTransaksi } from '../types';
import { BASE_URL, handleForbiddenError } from '@/app/utils/auth';


export const createServiceURL = (endpoint: string) => `${BASE_URL}/${endpoint}`;

export const detailTransaksiService = {

  getAllDetailTransaksi: async () => {
    try {
      const response = await api.get('/detailTransaksi');
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },
  
  getByTransaksiId: async (transaksiId: string) => {
    try {
      const response = await api.get(`/detailTransaksi/${transaksiId}`);
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  create: async (detailData: Partial<DetailTransaksi>) => {
    try {
      const response = await api.post('/detailTransaksi', detailData);
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  update: async (id: string, detailData: Partial<DetailTransaksi>) => {
    try {
      const response = await api.patch(`/detailTransaksi/${id}`, detailData);
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/detailTransaksi/${id}`);
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  }
};
