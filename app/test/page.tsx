"use client";

import { useAuth } from "@/context/auth-context";

export default function Test() {
  const context = useAuth();

  console.log(context)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <p>hi</p>
    </div>
  );
}
