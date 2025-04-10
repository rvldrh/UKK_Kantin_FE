"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Anda harus login terlebih dahulu!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push("/pages/login"); 
      }, 3000);
    }
  }, []);

  return null; 
};