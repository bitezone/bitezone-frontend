"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-800">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">Profile</h1>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Card className="mb-6 border-green-100">
          <CardHeader>
            <CardTitle className="text-xl text-green-700">Welcome Back</CardTitle>
            <CardDescription>You are now signed in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
