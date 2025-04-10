"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TransaksiService } from "@/app/services/transaksi.service";

export const TransaksiTable = () => {
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const bulanOptions = [
    { label: "Januari", value: 1 },
    { label: "Februari", value: 2 },
    { label: "Maret", value: 3 },
    { label: "April", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "Agustus", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Desember", value: 12 },
  ];

  const {
    data: transaksi,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transaksi", selectedMonth, selectedStatus],
    queryFn: async () => {
      if (selectedMonth) {
        const response = await TransaksiService.getByBulan(selectedMonth);
        return response || [];
      } else {
        const response = await TransaksiService.getAll();
        return response?.data?.transaksi || [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: pemasukan, isLoading: isLoadingPemasukan } = useQuery({
    queryKey: ["pemasukan", selectedMonth],
    queryFn: async () => {
      if (selectedMonth) {
        const response = await TransaksiService.getPemasukanBulanAdmin(
          selectedMonth
        );
        return response?.total_pemasukan || 0;
      } else {
        const response = await TransaksiService.getPemasukanBulanAdmin(
          selectedMonth
        );
        return response?.total_pemasukan || 0;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  console.log(pemasukan);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      TransaksiService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["transaksi"]);
    },
  });

  const deleteTransaksiMutation = useMutation({
    mutationFn: (id: string) => TransaksiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["transaksi"]);
      setShowModal(false);
    },
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error fetching data</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "belum dikonfirm":
        return "bg-red-200 text-red-700";
      case "dimasak":
        return "bg-orange-200 text-orange-700";
      case "diantar":
        return "bg-blue-200 text-blue-700";
      case "sampai":
        return "bg-green-200 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Daftar Transaksi</h2>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow">
          {isLoadingPemasukan ? (
            <span className="font-semibold text-green-700">Loading...</span>
          ) : selectedMonth ? (
            <span className="font-semibold text-green-700">
              Total pemasukan bulan ini: Rp {pemasukan.toLocaleString()}
            </span>
          ) : (
            <span className="text-gray-600 font-semibold ">
              Silakan pilih bulan untuk melihat total pemasukan bulan tersebut
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 flex space-x-4">
        {["belum dikonfirm", "dimasak", "diantar", "sampai"].map((status) => (
          <button
            key={status}
            type="button"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedStatus === status
                ? getStatusColor(status)
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() =>
              setSelectedStatus(status === selectedStatus ? null : status)
            }
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Filter berdasarkan bulan:
        </label>
        <select
          className="mt-1 block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm"
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          value={selectedMonth ?? ""}
        >
          <option value="">Semua Bulan</option>
          {bulanOptions.map((bulan) => (
            <option key={bulan.value} value={bulan.value}>
              {bulan.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Tanggal</th>
              <th className="border border-gray-300 px-4 py-2">Nama Stan</th>
              <th className="border border-gray-300 px-4 py-2">ID Siswa</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksi
              .filter((item) =>
                selectedStatus ? item.status === selectedStatus : true
              )
              .map((item) => (
                <tr key={item._id || "-"} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {item._id || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(item.tanggal).toLocaleString() || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id_stan?.nama_stan || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id_siswa?.nama_siswa || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Rp{" "}
                    {item.total_akhir ? item.total_akhir.toLocaleString() : "-"}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      className={`border px-2 py-1 rounded ${getStatusColor(
                        item.status
                      )}`}
                      value={item.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          id: item._id,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="belum dikonfirm">
                        Belum Dikonfirmasi
                      </option>
                      <option value="dimasak">Dimasak</option>
                      <option value="diantar">Diantar</option>
                      <option value="sampai">Sampai</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(item._id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Apakah Anda yakin ingin menghapus transaksi ini?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteTransaksiMutation.mutate(deleteId!)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
