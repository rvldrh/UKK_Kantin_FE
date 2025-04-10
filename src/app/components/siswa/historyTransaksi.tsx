"use client";

import React, { useEffect, useState } from "react";
import { TransaksiService } from "@/app/services/transaksi.service";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FaCheckCircle, FaClock, FaMotorcycle, FaUtensils } from "react-icons/fa";
import { detailTransaksiService } from "@/app/services/detailTransaksi.service";
import { NotaPembayaran } from "./nota";

const STATUS_ENUM = ['belum dikonfirm', 'dimasak', 'diantar', 'sampai'];

export const HistoryTransaksi = () => {
  const [siswaId, setSiswaId] = useState(null);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [selectedDetailTransaksi, setSelectedDetailTransaksi] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("belum dikonfirm");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setSiswaId(user?.id);
    }
  }, []);

  const { data: transaksi = [], isLoading } = useQuery({
    queryKey: ["historyTransaksi", siswaId],
    queryFn: () => siswaId ? TransaksiService.getBySiswaId(siswaId) : [],
    enabled: !!siswaId,
  });

  const { data: detailTransaksiData } = useQuery({
    queryKey: ["detailTransaksi", siswaId],
    queryFn: () => siswaId ? detailTransaksiService.getBySiswaId(siswaId) : [],
    enabled: !!siswaId,
  });

  const detailTransaksi = Array.isArray(detailTransaksiData?.data) ? detailTransaksiData?.data : [];
  const filteredTransaksi = transaksi?.data?.filter(item => item.status === selectedStatus);

  const handleOpenNota = (item) => {
    setSelectedTransaksi(item);
    const filteredDetails = detailTransaksi.filter((detail) => detail.id_transaksi?._id === item._id);
    setSelectedDetailTransaksi(filteredDetails);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 overflow-y-scroll h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">🛒 History Transaksi</h1>
      <div className="flex space-x-2 mb-4 justify-center">
        {STATUS_ENUM.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg text-white ${selectedStatus === status ? 'bg-blue-600' : 'bg-gray-400'}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      {filteredTransaksi?.length === 0 ? (
        <p className="text-center text-gray-600">Belum ada transaksi.</p>
      ) : (
        <div className="space-y-6">
          {filteredTransaksi?.map((item) => {
            const filteredDetailTransaksi = detailTransaksi.filter(
              (detail) => detail.id_transaksi?._id === item._id
            );

            return (
              <div key={item._id} className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">ID: {item._id}</h2>
                  <span className={`py-1 px-3 rounded-full text-white text-sm flex items-center gap-2 ${
                    item.status === "belum dikonfirm"
                      ? "bg-yellow-500"
                      : item.status === "dimasak"
                      ? "bg-blue-500"
                      : item.status === "diantar"
                      ? "bg-orange-500"
                      : item.status === "sampai"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}>
                    {item.status === "belum dikonfirm" && <FaClock />}
                    {item.status === "dimasak" && <FaUtensils />}
                    {item.status === "diantar" && <FaMotorcycle />}
                    {item.status === "sampai" && <FaCheckCircle />}
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="text-sm text-gray-500">Tanggal</p>
                    <p className="font-semibold">
                      {format(new Date(item.tanggal), "dd MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Harga Akhir</p>
                    <p className="font-semibold text-orange-600">
                      Rp {item.total_akhir.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {filteredDetailTransaksi.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detail Pesanan</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {filteredDetailTransaksi.map((detail) => (
                        <li key={detail._id} className="py-1">
                          {detail?.id_menu?.nama_makanan} - {detail.qty} x Rp {detail.harga_beli.toLocaleString("id-ID")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => handleOpenNota(item)}
                >
                  Lihat Nota Pembayaran
                </button>
              </div>
            );
          })}
        </div>
      )}
      {selectedTransaksi && (
        <NotaPembayaran
          transaksi={selectedTransaksi}
          detailTransaksi={selectedDetailTransaksi}
          onClose={() => setSelectedTransaksi(null)}
        />
      )}
    </div>
  );
};
