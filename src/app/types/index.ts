// Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  username: string;
  role: 'admin_stan' | 'siswa';
  createdAt: Date;
  updatedAt: Date;
}

export interface Siswa {
  _id: string;
  nama_siswa: string;
  alamat: string;
  telp: string;
  foto: string;
  id_user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stan {
  _id: string;
  nama_stan: string;
  nama_pemilik: string;
  telp: string;
  id_user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Menu {
  _id: string;
  nama_makanan: string;
  harga: number;
  jenis: 'makanan' | 'minuman';
  foto: string;
  deskripsi: string;
  id_stan: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaksi {
  _id: string;
  tanggal: Date;
  id_stan: string;
  id_siswa: string;
  status: 'belum dikonfirm' | 'dimasak' | 'diantar' | 'sampai';
  createdAt: Date;
  updatedAt: Date;
}

export interface DetailTransaksi {
  _id: string;
  id_transaksi: string;
  id_menu: string;
  qty: number;
  harga_beli: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Diskon {
  _id: string;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: Date;
  tanggal_akhir: Date;
  createdAt: Date;
  updatedAt: Date;
} 