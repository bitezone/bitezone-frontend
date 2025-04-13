"use client"
import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    if (!client_id || !redirect_uri) {
      console.error("Missing Google OAuth environment variables");
      return;
    }

    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent"
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;