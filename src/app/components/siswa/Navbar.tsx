"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoginn");
      setIsLoggedIn(loginStatus === "true");
      
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.foto) {
        setProfilePic(user.foto);
      } else {
        setProfilePic(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("persist:cart");
    localStorage.setItem("isLoginn", "false");
    window.dispatchEvent(new Event("storage"));
    router.push("/pages/login");
  };

  const menuItems = [
    { href: "/pages/menu", label: "Menu" },
    { href: "/pages/cart", label: "Keranjang" },
    { href: "/pages/historyTransaksi", label: "History" },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-500">Kantin</span>
            <span className="text-2xl font-light text-gray-700">Digital</span>
          </Link>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {item.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/pages/profileUser">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gray-500" />
                  )}
                </Link>
                <button className="bg-orange-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600" onClick={() => setIsModalOpen(true)}>
                  Keluar
                </button>
              </div>
            ) : (
              <Link href="/pages/login" className="bg-orange-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600">
                Masuk
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              {!isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800">Konfirmasi Logout</h2>
            <p className="text-gray-600 mt-2">Apakah Anda yakin ingin keluar?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>
                Batal
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={logout}>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}