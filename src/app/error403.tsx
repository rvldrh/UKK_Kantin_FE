"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const Error403Middleware = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const handleConsoleError = (event) => {
      if (event.message && event.message.includes("403")) {
        router.push("/notallowed");
      }
    };

    window.addEventListener("error", handleConsoleError);

    return () => {
      window.removeEventListener("error", handleConsoleError);
    };
  }, [router]);

  return <>{children}</>;
};
