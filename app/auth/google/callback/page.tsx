"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const exchangeCode = async () => {
      if (error) {
        console.error("OAuth error:", error);
        router.push(`/user/login?error=${encodeURIComponent(error)}`);
        return;
      }

      if (!code) {
        router.push("/user/login?error=missing_code");
        return;
      }
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

        // Exchange the Google code with your Django backend for tokens
        axios
          .post(
            `${backendUrl}/users/authenticate/google/`,
            { code },
            { withCredentials: true }
          )
          .then((res) => {
            console.log(res.data);
            const { access, refresh } = res.data;

            if (access) {
              localStorage.setItem("accessToken", access);
            }
            if (refresh) {
              localStorage.setItem("refreshToken", refresh);
            }

            router.push("/dashboard");
          });
      } catch (err) {
        console.error("Token exchange failed:", err);
        router.push("/user/login?error=auth_failed");
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return <div className="p-4">Authenticating with Google...</div>;
}
