"use client";

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/siswa/Navbar";
import { Sidebar } from "./components/admin/sidebar";
import store from "@/redux/store";
import { LoginCheck } from "@/loginCheck";
import { persistStore } from "redux-persist";
import PersistProvider from "./persistProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  const [userRole, setUserRole] = useState<string>("");

  const getUserRole = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).role : "";
    }
    return "";
  };

  useEffect(() => {
    setUserRole(getUserRole());
    const handleStorageChange = () => {
      setUserRole(getUserRole());
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  console.log("User Role:", userRole);

  return (
    <PersistProvider>
      <html lang="en">
        <QueryClientProvider client={queryClient}>
        <body className="min-h-screen bg-gray-50 flex w-full">
            {userRole === "siswa" ? (
              <>
                <Navbar />
                <main className="flex-1">{children}</main>
              </>
            ) : userRole === "admin_stan" ? (
              <Sidebar>{children}</Sidebar>
            ) : (
              <main className="flex-1">{children}</main>
            )}
            <LoginCheck />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#22c55e",
                  },
                },
                error: {
                  duration: 3000,
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
          </body>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </html>
    </PersistProvider>
  );
}
