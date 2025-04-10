import api from '@/app/utils/axios';
import { BASE_URL, handleForbiddenError } from '../utils/auth';
import { getHeaders } from './serviceHelper';
const TRANSAKSI_URL = `${BASE_URL}/transaksi`;


export const TransaksiService = {
  async getAll() {
    try {
      const response = await api.get(TRANSAKSI_URL, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async getById(id: string) {
    try {
      const response = await api.get(`${TRANSAKSI_URL}/${id}`, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async getBySiswaId() {
    try {
      const response = await api.get(`${TRANSAKSI_URL}/siswa`, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async create(transaksiData: Partial<Transaksi>) {
    try {
      const response = await api.post(TRANSAKSI_URL, transaksiData, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async getByStan() {
    try {
      const response = await api.get(`${TRANSAKSI_URL}/stan`, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async updateStatus(id: string, status: Transaksi['status']) {
    try {
      const response = await api.patch(`${TRANSAKSI_URL}/status/${id}`, { status }, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async getByBulan(bulan: number) {
    try {
      const response = await api.get(`${TRANSAKSI_URL}/bulan/${bulan}`, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async delete(id: string) {
    try {
      const response = await api.delete(`${TRANSAKSI_URL}/${id}`, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },

  async getPemasukanBulanAdmin(bulan: number) {
    try {
      const response = await api.get(`${TRANSAKSI_URL}/pemasukan/${bulan}`, getHeaders());
      return response.data;
    } catch (error) {
      handleForbiddenError(error);
    }
  },
};
