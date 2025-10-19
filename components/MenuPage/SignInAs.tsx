"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { ChevronDown, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DiningHallsStatusModal from "./DiningHallsStatusModal";

interface SignInAsProps {
  currentDate?: Date;
}

export default function SignInAs({ currentDate = new Date() }: SignInAsProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl flex justify-between items-center">
        <DiningHallsStatusModal currentDate={currentDate} />
        <Skeleton className="h-10 w-[150px] rounded-md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-4xl flex justify-between items-center">
        <DiningHallsStatusModal currentDate={currentDate} />
        <Button
          onClick={handleLogin}
          variant="outline"
          className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
        >
          <LogIn className="h-4 w-4" />
          <span className="">Sign In</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl flex justify-between items-center">
      <DiningHallsStatusModal currentDate={currentDate} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <User className="h-3 w-3 text-green-600" />
              </div>
              <span className="max-w-[150px] sm:max-w-[250px] truncate">
                {user?.name || user?.email}
              </span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="text-red-500 focus:text-red-500 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
