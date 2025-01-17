export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    role: 'siswa' | 'admin_stan';
    nama_siswa?: string;
    nama_stan?: string;
    alamat: string;
    telp: string;
}

export interface AuthResponse {
    status: string;
    token: string;
    data: {
        user: {
            username: string;
            role: string;
            profileId: string;
        }
    }
}