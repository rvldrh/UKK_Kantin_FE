import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import type { Menu } from '../types';

const MENU_URL = createServiceURL('menu');

export const menuService = {
    getAll: async () => {
        const response = await api.get(MENU_URL, getHeaders());
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${MENU_URL}/${id}`, getHeaders());
        return response.data;
    },

    create: async (menuData: Partial<Menu>) => {
        const response = await api.post(MENU_URL, menuData, getHeaders());
        return response.data;
    },

    update: async (id: string, menuData: Partial<Menu>) => {
        const response = await api.put(`${MENU_URL}/${id}`, menuData, getHeaders());
        return response.data;
    }
}; 