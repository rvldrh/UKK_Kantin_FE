import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Siswa } from '../types';

const SISWA_URL = createServiceURL('siswa');

export const siswaService = {
    getAll: async () => {
        const response = await api.get(SISWA_URL, getHeaders());
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${SISWA_URL}/${id}`, getHeaders());
        return response.data;
    },

    create: async (siswaData: Partial<Siswa>) => {
        const response = await api.post(SISWA_URL, siswaData, getHeaders());
        return response.data;
    },

    update: async (id: string, siswaData: Partial<Siswa>) => {
        const response = await api.put(`${SISWA_URL}/${id}`, siswaData, getHeaders());
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`${SISWA_URL}/${id}`, getHeaders());
        return response.data;
    }
}; 