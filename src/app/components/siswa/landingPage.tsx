"use client";
import React, { useEffect, useState } from "react";
import { menuService } from "../../services/menu.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import { setUserId } from "@/redux/slices/cartSlice";

export const LandingPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const userId = useSelector((state) => state.cart.userId);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      dispatch(setUserId(parsedUser.profile?.id_user));
    }
  }, [dispatch]);

  const { data: menus, isLoading } = useQuery({
    queryKey: ["menus-with-diskon"],
    queryFn: menuService.getMenuWithDiskon,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const handlePesan = (menu) => {
    if (!userId) {
      alert("Anda harus login terlebih dahulu!");
      router.push("/login");
      return;
    }

    dispatch(addItem({ ...menu, userId }));
    setShowModal(true);

    setTimeout(() => {
      router.push("/pages/cart");
    }, 2000);
  };

  const groupedMenus = menus?.data?.reduce((acc, menu) => {
    const stanId = menu.id_stan._id;
    if (!acc[stanId]) {
      acc[stanId] = { nama_stan: menu.id_stan.nama_stan, menus: [] };
    }
    acc[stanId].menus.push(menu);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Our Menu
      </h1>
      {groupedMenus &&
        Object.entries(groupedMenus).map(([stanId, { nama_stan, menus }]) => (
          <div key={stanId} className="mb-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              {nama_stan}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => {
                const diskon = menu?.diskon?.persentase;
                const hargaAsli = menu.harga;
                const hargaDiskon = menu?.diskon?.harga_setelah_diskon;

                return (
                  <div
                    key={menu._id}
                    className="relative bg-white shadow-md rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {diskon && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md z-10">
                        -{Math.round(diskon * 10)}%
                      </div>
                    )}

                    <div className="relative w-full h-48">
                      {menu.foto && (
                        <Image
                          src={`/img/menuImg/${menu.foto}`}
                          alt={menu.nama_makanan}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-2xl"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-bold text-gray-900">
                        {menu.nama_makanan}
                      </h2>
                      <p className="text-sm text-gray-600 my-2">
                        {menu.deskripsi}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        {diskon ? (
                          <div>
                            <span className="text-lg font-semibold text-gray-500 line-through">
                              Rp {hargaAsli.toLocaleString("id-ID")}
                            </span>
                            <span className="text-lg font-bold text-orange-600 ml-2">
                              Rp {hargaDiskon.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-semibold text-orange-600">
                            Rp {hargaAsli.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                      <button
                        className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition duration-300"
                        onClick={() => handlePesan(menu)}
                      >
                        Pesan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Modal Berhasil Pesan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Berhasil Dipesan!
            </h2>
            <p className="text-gray-700">Pesanan telah ditambahkan ke keranjang.</p>
            <button
              onClick={() => router.push("/pages/cart")}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg"
            >
              Lihat Keranjang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
