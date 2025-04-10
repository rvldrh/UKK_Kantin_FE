import api from "@/app/utils/axios";
import { getHeaders, createServiceURL } from "@/app/services/serviceHelper";
import type { Siswa } from "../types";
import { handleForbiddenError } from "../utils/auth";

const SISWA_URL = createServiceURL("siswa");

export const siswaService = {
	getAll: async () => {
		try {
			const response = await api.get(SISWA_URL, getHeaders());
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},

	getById: async (id: string) => {
		try {
			const response = await api.get(`${SISWA_URL}/${id}`, getHeaders());
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},

	create: async (siswaData: FormData) => {
		try {
			const response = await api.post(SISWA_URL, siswaData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},

	update: async (id: string, siswaData: Partial<Omit<Siswa, "foto">>) => {
		try {
			const response = await api.patch(
				`${SISWA_URL}/${id}`,
				siswaData,
				getHeaders(),
			);
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},

	updateFoto: async (id: string, fotoData: FormData) => {
		try {
			const response = await api.patch(
				`${SISWA_URL}/update-foto/${id}`,
				fotoData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},

	delete: async (id: string) => {
		try {
			const response = await api.delete(`${SISWA_URL}/${id}`, getHeaders());
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},

	updateSiswaData: async (
		id: string,
		siswaData: Partial<{ nama_siswa: string; alamat: string; telp: string }>,
	) => {
		try {
			const response = await api.patch(
				`${SISWA_URL}/updateSiswa/${id}`,
				siswaData,
				getHeaders(),
			);
			return response.data;
		} catch (error) {
			handleForbiddenError(error);
		}
	},
};
