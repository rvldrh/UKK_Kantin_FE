import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Stan } from '../types';
import { handleForbiddenError } from '../utils/auth';
const STAN_URL = createServiceURL('stan');

export const stanService = {
    getAll: async () => {
        try {
            const response = await api.get(STAN_URL, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    getById: async (id: string) => {
        try {
            const response = await api.get(`${STAN_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    create: async (stanData: Partial<Stan>) => {
        try {
            const response = await api.post(STAN_URL, stanData, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    update: async (id: string, stanData: Partial<Stan>) => {
        try {
            const response = await api.patch(`${STAN_URL}/${id}`, stanData, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    delete: async (id: string) => {
        try {
            const response = await api.delete(`${STAN_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    },

    getByUser: async () => {
        try {
            const response = await api.get(`${STAN_URL}/stan`, getHeaders());
            return response.data;
        } catch (error) {
            handleForbiddenError(error);
        }
    }
};
