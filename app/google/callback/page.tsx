"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) {
      console.error(error);
    }
    if (code) {
      try {
        axios
          .post(
            process.env.BACKEND_URL + "/api/v1/auth/google/exchange-code/",
            { code }
          )
          .then((res) => {
            console.log(res.data.access_token);
            localStorage.setItem("accessToken", res.data.access_token);
            localStorage.setItem("idToken", res.data.id_token);
            localStorage.setItem("refreshToken", res.data.refresh_token);
          })
          .then(() => {
            console.log({
              access_token: localStorage.getItem("accessToken"),
              code: code,
              id_token: { id_token: localStorage.getItem("idToken") },
            });
            axios.post(process.env.BACKEND_URL + "/api/v1/auth/google/", {
              access_token: localStorage.getItem("accessToken"),
              code: code,
              id_token: { id_token: localStorage.getItem("idToken") },
            });
          });
      } catch (err) {
        console.error(err);
      }
    }
  }, [router, searchParams]);

  return <div>Loading</div>;
};

export default Page;
