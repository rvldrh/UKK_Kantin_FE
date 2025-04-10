export interface Transaksi {
    _id: string;
    tanggal: string;
    id_stan: string;
    id_siswa: string;
    total: number;
    total_akhir: number;
    diskon?: {
      nama_diskon: string;
      persentase: number;
    };
    status: string;
  }