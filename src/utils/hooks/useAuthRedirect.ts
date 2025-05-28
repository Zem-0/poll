"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // Allow public routes
      const publicRoutes = ["/signin", "/signup", "/"];
      if (publicRoutes.includes(pathname)) return;

      if (!token) {
        router.replace("/signin");
        return;
      }

      // Optional: check if token is valid from server
      try {
        const res = await fetch("/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!data?.valid) {
          localStorage.removeItem("access_token");
          router.replace("/signin");
        }
      } catch (err) {
        console.error("Token validation error", err);
        router.replace("/signin");
      }
    };

    checkAuth();
  }, [pathname, router]);
};

export default useAuthRedirect;
