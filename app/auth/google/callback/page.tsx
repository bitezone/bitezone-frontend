"use client";

import { Suspense } from "react";
import GoogleCallbackInner from "./GoogleCallBack";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="p-4">Authenticating with Google...</div>}>
      <GoogleCallbackInner />
    </Suspense>
  );
}
