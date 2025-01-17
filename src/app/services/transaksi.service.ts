import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Transaksi } from '../types';

const TRANSAKSI_URL = createServiceURL('transaksi');

export const transaksiService = {
    getAll: async () => {
        const response = await api.get(TRANSAKSI_URL, getHeaders());
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${TRANSAKSI_URL}/${id}`, getHeaders());
        return response.data;
    },

    create: async (transaksiData: Partial<Transaksi>) => {
        const response = await api.post(TRANSAKSI_URL, transaksiData, getHeaders());
        return response.data;
    },

    updateStatus: async (id: string, status: Transaksi['status']) => {
        const response = await api.put(
            `${TRANSAKSI_URL}/${id}/status`, 
            { status }, 
            getHeaders()
        );
        return response.data;
    }
}; 