import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Diskon } from '../types';

const DISKON_URL = createServiceURL('diskon');

export const diskonService = {
    getAll: async () => {
        const response = await api.get(DISKON_URL, getHeaders());
        return response.data;
    },

    getActive: async () => {
        const response = await api.get(`${DISKON_URL}/active`, getHeaders());
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${DISKON_URL}/${id}`, getHeaders());
        return response.data;
    },

    create: async (diskonData: Partial<Diskon>) => {
        const response = await api.post(DISKON_URL, diskonData, getHeaders());
        return response.data;
    },

    update: async (id: string, diskonData: Partial<Diskon>) => {
        const response = await api.put(`${DISKON_URL}/${id}`, diskonData, getHeaders());
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`${DISKON_URL}/${id}`, getHeaders());
        return response.data;
    }
}; 