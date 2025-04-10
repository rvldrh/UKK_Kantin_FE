"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, removeItemsByUserId } from "@/redux/slices/cartSlice";
import { TransaksiService } from "@/app/services/transaksi.service";
import toast from "react-hot-toast";

export const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser?.id);
    }
  }, []);

  const filteredCartItems = userId
    ? cartItems.filter((item) => item.userId === userId)
    : [];

  const groupedItems = filteredCartItems.reduce((acc, item) => {
    if (!acc[item._id]) {
      acc[item._id] = { ...item, quantity: item.quantity || 1 };
    } else {
      acc[item._id].quantity += item.quantity || 1;
    }
    return acc;
  }, {});

  const cartItemsObj = Object.values(groupedItems).map((item) => {
    const diskon = item?.diskon?.persentase || 0;
    const hargaSetelahDiskon = item.harga * (1 - diskon);
    const totalAsli = item.quantity * item.harga;
    const totalDiskon = item.quantity * hargaSetelahDiskon;
    const total_akhir = item?.diskon?.harga_setelah_diskon
      ? item.diskon.harga_setelah_diskon * item.quantity
      : totalAsli;
    return {
      ...item,
      totalAsli,
      totalDiskon,
      total_akhir,
      hargaSetelahDiskon,
    };
  });

  const handleRemoveItem = (id) => {
    dispatch(removeItem({ _id: id, userId }));
  };

  const handleCheckout = async () => {
    try {
      const detailPesanan = cartItemsObj.map((item) => ({
        id_menu: item._id,
        qty: item.quantity,
      }));

      const payload = { detail_pesanan: detailPesanan };
      await TransaksiService.create(payload);
      toast.success("Pesanan berhasil diterima!");
      dispatch(removeItemsByUserId());
    } catch (err) {
      console.error("Error checkout:", err);
      toast.error(err.response?.data?.message || "Gagal melakukan pesanan");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🛒 Cart</h2>

      {cartItemsObj.length === 0 ? (
        <p className="text-gray-600 text-center">Keranjang kosong.</p>
      ) : (
        <div className="space-y-4">
          {cartItemsObj.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.nama_makanan}</h3>
                <p className="text-gray-600 text-sm">Stan: {item?.id_stan?.nama_stan}</p>
                <p className="text-gray-600 text-sm">Jumlah: {item.quantity}</p>
                <p className="text-gray-600 text-sm">Harga: <span className="font-semibold">Rp. {item.harga.toLocaleString()}</span></p>
                <p className="text-gray-800 font-semibold">Total: Rp. {item.total_akhir.toLocaleString()}</p>
              </div>

              <button
                onClick={() => handleRemoveItem(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItemsObj.length > 0 && (
        <button
          onClick={handleCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mt-6 transition"
        >
          Checkout
        </button>
      )}
    </div>
  );
};
