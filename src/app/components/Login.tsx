'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/app/services/auth.service';
import { toast } from 'react-hot-toast';

interface LoginData {
    username: string;
    password: string;
}

export function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginData>({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(formData);
            
            if (response.token) {
                // Simpan token dan user info
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                toast.success('Login berhasil!');
                
                // Redirect berdasarkan role
                if (response.data.user.role === 'admin_stan') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/siswa/menu');
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal masuk ke akun');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Selamat Datang
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Masukkan username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                            text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
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
                                'Masuk'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Belum punya akun?{' '}
                            <Link 
                                href="/pages/register" 
                                className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}