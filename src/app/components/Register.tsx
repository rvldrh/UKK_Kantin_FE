"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { authService, RegisterData } from "@/app/services/auth.service";

interface FormErrors {
    username?: string;
    password?: string;
    nama_siswa?: string;
    nama_stan?: string;
    nama_pemilik?: string;
    alamat?: string;
    telp?: string;
}

export function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterData>({
        username: '',
        password: '',
        role: 'siswa',
        nama_siswa: '',
        nama_stan: '',
        nama_pemilik: '',
        alamat: '',
        telp: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!formData.username || formData.username.length < 4) {
            newErrors.username = 'Username minimal 4 karakter';
            isValid = false;
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
            isValid = false;
        }
        if (!formData.alamat) {
            newErrors.alamat = 'Alamat wajib diisi';
            isValid = false;
        }
        if (!formData.telp || !/^[0-9]{10,13}$/.test(formData.telp)) {
            newErrors.telp = 'Nomor telepon tidak valid (10-13 digit)';
            isValid = false;
        }

        if (formData.role === 'siswa') {
            if (!formData.nama_siswa) {
                newErrors.nama_siswa = 'Nama siswa wajib diisi';
                isValid = false;
            }
        } else {
            if (!formData.nama_stan) {
                newErrors.nama_stan = 'Nama stan wajib diisi';
                isValid = false;
            }
            if (!formData.nama_pemilik) {
                newErrors.nama_pemilik = 'Nama pemilik wajib diisi';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Mohon lengkapi semua field yang diperlukan');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                role: formData.role,
                alamat: formData.alamat,
                telp: formData.telp,
                ...(formData.role === 'siswa' 
                    ? { nama_siswa: formData.nama_siswa }
                    : { 
                        nama_stan: formData.nama_stan,
                        nama_pemilik: formData.nama_pemilik 
                    }
                )
            };

            const response = await authService.register(payload);
            
            if (response.status === 'success') {
                toast.success('Registrasi berhasil! Silahkan login.');
                router.push('/pages/login');
            }
        } catch (err: any) {
            toast.error(err.message || 'Gagal melakukan registrasi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Daftar Akun Baru
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-medium text-orange-500 hover:text-orange-400">
                            Masuk di sini
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Daftar Sebagai
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        role: e.target.value as 'siswa' | 'admin_stan',
                                        nama_siswa: '',
                                        nama_stan: '',
                                        nama_pemilik: ''
                                    });
                                    setErrors({});
                                }}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            >
                                <option value="siswa">Siswa</option>
                                <option value="admin_stan">Pemilik Stan</option>
                            </select>
                        </div>

                        {/* Username & Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Conditional Fields based on Role */}
                        {formData.role === 'siswa' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Siswa</label>
                                <input
                                    type="text"
                                    value={formData.nama_siswa}
                                    onChange={(e) => setFormData({ ...formData, nama_siswa: e.target.value })}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.nama_siswa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                                />
                                {errors.nama_siswa && <p className="mt-1 text-sm text-red-600">{errors.nama_siswa}</p>}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Stan</label>
                                    <input
                                        type="text"
                                        value={formData.nama_stan}
                                        onChange={(e) => setFormData({ ...formData, nama_stan: e.target.value })}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.nama_stan ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                                    />
                                    {errors.nama_stan && <p className="mt-1 text-sm text-red-600">{errors.nama_stan}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Pemilik</label>
                                    <input
                                        type="text"
                                        value={formData.nama_pemilik}
                                        onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.nama_pemilik ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                                    />
                                    {errors.nama_pemilik && <p className="mt-1 text-sm text-red-600">{errors.nama_pemilik}</p>}
                                </div>
                            </>
                        )}

                        {/* Alamat & Telepon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat</label>
                            <input
                                type="text"
                                value={formData.alamat}
                                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                            />
                            {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">No Telepon</label>
                            <input
                                type="tel"
                                value={formData.telp}
                                onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.telp ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                            />
                            {errors.telp && <p className="mt-1 text-sm text-red-600">{errors.telp}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </div>
                            ) : (
                                'Daftar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
