"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LogOut,
  SquareMenu,
  Settings,
  TicketPercent,
  History,
  Users,
  Store,
} from "lucide-react";
import React from "react";
import clsx from "clsx";

export const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white flex flex-col transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <button
          className="p-4 focus:outline-none text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "◀" : "▶"}
        </button>

        <nav className="flex-1 px-4 py-2 space-y-2">
          <SidebarItem
            href="/pages/admin/dashboard"
            icon={<SquareMenu size={20} />}
            label="Menu"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/pages/admin/diskon"
            icon={<TicketPercent size={20} />}
            label="Diskon"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/pages/admin/transaksi"
            icon={<History size={20} />}
            label="Transaksi"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/pages/admin/pelanggan"
            icon={<Users size={20} />}
            label="Pelanggan"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/pages/admin/settings"
            icon={<Settings size={20} />}
            label="Settings"
            isOpen={isOpen}
          />
        </nav>

        <button
          className="p-4 w-full text-left flex items-center space-x-2 hover:bg-gray-800"
          onClick={() => {
            window.location.href = "/pages/admin/profileStan";
          }}
        >
          <Store size={20} />
          {isOpen && <span>Profile</span>}
        </button>
        <button
          className="p-4 w-full text-left flex items-center space-x-2 hover:bg-gray-800"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/pages/login";
          }}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      {/* Content area */}
      <div
        className={clsx(
          "flex-1 p-6 bg-gray-100 overflow-auto transition-all duration-300",
          isOpen ? "ml-64" : "ml-20"
        )}
      >
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

function SidebarItem({ href, icon, label, isOpen }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md"
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
