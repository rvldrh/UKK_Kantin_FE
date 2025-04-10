"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siswaService } from "@/app/services/siswa.service";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserCircle, Loader2, XCircle } from "lucide-react";

export default function ProfileUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    nama_siswa: "",
    alamat: "",
    telp: "",
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userId = JSON.parse(storedUser)?.profile?._id;
    if (!storedUser) {
      router.push("/pages/login");
    } else {
      setUserId(userId);
    }
  }, [router]);

  const { data: siswa, isLoading, isError } = useQuery({
    queryKey: ["siswa", userId],
    queryFn: () => (userId ? siswaService.getById(userId) : null),
    enabled: !!userId,
    onError: () => {
      setErrorMessage("Gagal mengambil data siswa. Silakan coba lagi.");
      setIsErrorModalOpen(true);
    },
  });

  useEffect(() => {
    if (siswa?.data) {
      setFormData({
        nama_siswa: siswa.data.nama_siswa || "",
        alamat: siswa.data.alamat || "",
        telp: siswa.data.telp || "",
      });
    }
  }, [siswa]);

  const updateFotoMutation = useMutation({
    mutationFn: (updatedData: FormData) => siswaService.updateFoto(userId!, updatedData),
    onMutate: () => setIsUploading(true),
    onSuccess: () => {
      queryClient.invalidateQueries(["siswa", userId]);
      setIsUploading(false);
    },
    onError: () => {
      setIsUploading(false);
      setErrorMessage("Gagal mengupload foto. Silakan coba lagi.");
      setIsErrorModalOpen(true);
    },
  });

  const idSiswa = siswa?.data?._id;

  const updateDataMutation = useMutation({
    mutationFn: (updatedData: Partial<typeof formData>) => siswaService.updateSiswaData(idSiswa, updatedData),
    onMutate: () => setIsUpdating(true),
    onSuccess: () => {
      queryClient.invalidateQueries(["siswa", userId]);
      setIsUpdating(false);
      setIsModalOpen(false);
    },
    onError: () => {
      setIsUpdating(false);
      setErrorMessage("Gagal memperbarui data. Silakan coba lagi.");
      setIsErrorModalOpen(true);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedData = new FormData();
      updatedData.append("foto", file);
      updateFotoMutation.mutate(updatedData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateData = () => {
    updateDataMutation.mutate(formData);
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !siswa) return <p className="text-center mt-10 text-red-500">Gagal mengambil data.</p>;

  const siswaData = siswa?.data;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        {isUploading ? (
          <Loader2 className="w-24 h-24 text-orange-500 animate-spin" />
        ) : siswaData.foto ? (
          <Image
            src={`/img/siswaImg/${siswaData.foto}`}
            alt="Foto Profil"
            width={100}
            height={100}
            className="rounded-full border-2 border-orange-500"
          />
        ) : (
          <UserCircle className="w-24 h-24 text-gray-400" />
        )}

        <h2 className="text-2xl font-semibold mt-4">{siswaData.nama_siswa}</h2>
        <p className="text-gray-600 mt-1">{siswaData.alamat}</p>
        <p className="text-gray-600">{siswaData.telp}</p>

        <div className="flex mt-4 space-x-4">
          <label className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 cursor-pointer">
            {isUploading ? "Mengupload..." : "Ganti Foto"}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </label>

          <button
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-100"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Data
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Data Siswa</h2>

            <label className="block text-gray-700">Nama</label>
            <input
              type="text"
              name="nama_siswa"
              value={formData.nama_siswa}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />

            <label className="block text-gray-700 mt-2">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />

            <label className="block text-gray-700 mt-2">No. Telepon</label>
            <input
              type="text"
              name="telp"
              value={formData.telp}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            />

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleUpdateData}
                disabled={isUpdating}
              >
                {isUpdating ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isErrorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="text-red-500 mt-2">{errorMessage}</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => setIsErrorModalOpen(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
