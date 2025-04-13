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

          console.log("🔐 Token Exchange Success:", { access_token, id_token });
          console.log("🧪 TOKEN FORMAT CHECK:", id_token, typeof id_token, id_token?.split(".").length);

          // Ensure the token is valid format (optional extra check)
          if (!id_token || typeof id_token !== "string" || id_token.split(".").length !== 3) {
            throw new Error("Invalid id_token format");
          }

          return axios.post("http://localhost:8000/api/auth/google/", {
            access_token,
            id_token,
          });
        })
        .then((response) => {
          const data = response.data;
          console.log("Data : ", data)
          console.log("✅ Login success:", data);

          // Store tokens
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          localStorage.setItem("userInfo", JSON.stringify(data.user || {}));

          console.log("🔁 Stored refreshToken:", localStorage.getItem("refreshToken"));

        //   router.replace("/profile");
        })
        .catch((err) => {
          console.error("❌ Error during Google authentication:", err.response?.data || err.message);
          router.replace("/login");
        });
    } else if (error) {
      console.error("❌ Google callback error:", error);
      router.replace("/login");
    }
  }, [router, searchParams]);

  return <p>Logging in with Google...</p>;
}
