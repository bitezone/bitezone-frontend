"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (code) {
      axios
        .post("http://localhost:8000/api/auth/google/exchange-code/", { code })
        .then((response) => {
          const { access_token, id_token } = response.data;
          console.log({ 
            access_token,
            code,
            id_token
          })
          
          return axios.post("http://localhost:8000/api/auth/google/", { 
            access_token,
            code,
            id_token
          });
        })
        .then((response) => {
          const data = response.data;
          console.log("Login success, JWT:", data);

          // Store tokens and user info
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);

          if (data.user) {
            localStorage.setItem("userInfo", JSON.stringify(data.user));
          }

          // Redirect to homepage
          router.replace("/profile");
        })
        .catch((err) => {
          console.error("Error during authentication", err);
          router.replace("/login");
        });
    } else if (error) {
      console.error("Google login error:", error);
      router.replace("/login");
    }
  }, [router, searchParams]);

  return <p>Logging in with Google...</p>;
}