import Link from 'next/link';

export const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
        <p className="text-gray-600 mb-6">
          Maaf, kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};
