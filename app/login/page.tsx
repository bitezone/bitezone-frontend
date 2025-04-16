"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(isLoading, isAuthenticated)
    if (!isLoading && isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
        prompt: "consent",
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      window.location.href = googleAuthUrl;
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg border-green-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800">
            Sign In
          </CardTitle>
          <CardDescription>
            Continue with Google to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <button
            className="w-full flex items-center justify-center gap-2 h-12 border-2 rounded-md bg-white hover:bg-gray-50 transition-colors"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <GoogleIcon />
            <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
          </button>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
