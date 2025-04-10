import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Diskon } from '../types';
import { handleForbiddenError } from '../utils/auth';

const DISKON_URL = createServiceURL('diskon');

export const diskonService = {
    getAll: async () => {
        try {
            const response = await api.get(DISKON_URL, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    getActive: async () => {
        try {
            const response = await api.get(`${DISKON_URL}/active`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    getById: async (id: string) => {
        try {
            const response = await api.get(`${DISKON_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    create: async (diskonData: Partial<Diskon>) => {
        try {
            const response = await api.post(DISKON_URL, diskonData, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    update: async (id: string, diskonData: Partial<Diskon>) => {
        try {
            const response = await api.patch(`${DISKON_URL}/${id}`, diskonData, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    delete: async (id: string) => {
        try {
            const response = await api.delete(`${DISKON_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    getByStanId: async () => {
        try {
            const response = await api.get(`${DISKON_URL}/stan`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    }
};
