import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Stan } from '../types';

const STAN_URL = createServiceURL('stan');

export const stanService = {
    getAll: async () => {
        const response = await api.get(STAN_URL, getHeaders());
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${STAN_URL}/${id}`, getHeaders());
        return response.data;
    },

    create: async (stanData: Partial<Stan>) => {
        const response = await api.post(STAN_URL, stanData, getHeaders());
        return response.data;
    },

    update: async (id: string, stanData: Partial<Stan>) => {
        const response = await api.put(`${STAN_URL}/${id}`, stanData, getHeaders());
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`${STAN_URL}/${id}`, getHeaders());
        return response.data;
    }
}; 