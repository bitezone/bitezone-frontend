"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/auth-context";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {checkAuthStatus} = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const exchangeCode = async () => {
      if (error) {
        console.error("OAuth error:", error);
        router.push(`/login?error=${encodeURIComponent(error)}`);
        return;
      }

      if (!code) {
        router.push("/login?error=missing_code");
        return;
      }
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

        axios
          .post(
            `${backendUrl}/users/authenticate/google/`,
            { code },
            { withCredentials: true }
          )
          .then(async (res) => {
            console.log(res.data);
            const { access, refresh } = res.data;

            if (access) {
              localStorage.setItem("accessToken", access);
            }
            if (refresh) {
              localStorage.setItem("refreshToken", refresh);
            }

            await checkAuthStatus();
            router.push("/profile");
          });
      } catch (err) {
        console.error("Token exchange failed:", err);
        router.push("/login?error=auth_failed");
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return <div className="p-4">Authenticating with Google...</div>;
}
