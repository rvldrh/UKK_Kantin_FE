import api from '@/app/utils/axios';
import { getHeaders, createServiceURL } from '@/app/services/serviceHelper';
import { handleAuthError, handleForbiddenError } from '../utils/auth';

const MENU_URL = createServiceURL('menu');


export const menuService = {
    getAll: async () => {
        try {
            const response = await api.get(MENU_URL, getHeaders());
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    },
    
    getById: async (id: string) => {
        try {
            const response = await api.get(`${MENU_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    },
    
    getMenuWithDiskon: async () => {
        try {
            const response = await api.get(`${MENU_URL}/with-diskon`, getHeaders());
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    },
    
    getMenuByIdStand: async () => { 
        try {
            const response = await api.get(`${MENU_URL}/stan/pemilik`, getHeaders());
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    },
    
    create: async (menuData: FormData) => {
        try {
            const response = await api.post(MENU_URL, menuData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    },
    
    delete: async (id: string) => {
        try {
            const response = await api.delete(`${MENU_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    },
    
    update: async (id: string, menuData: FormData) => {
        try {
            const response = await api.patch(
                `${MENU_URL}/${id}`,
                menuData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", 
                    }
                }
            );
            return response.data;
        } catch (error) {
            handleAuthError(error);
            handleForbiddenError(error);
        }
    }
};
