import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import BottomNavigation from "@/components/BottomNavigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBarNavigation } from "@/components/SideBarNavigation";

export const metadata: Metadata = {
  title: "BiteZone",
  description: "A place where dining takes fast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          <AuthProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "10rem",
                } as React.CSSProperties
              }
            >
              <div className="hidden md:block">
                <SideBarNavigation />
              </div>
              <main className="w-full bg-green-50">
                {/* <SidebarTrigger className="hidden md:block p-5 hover:bg-transparent hover:text-inherit cursor-pointer" /> */}
                {children}
              </main>
            </SidebarProvider>

            <div className="block md:hidden">
              <BottomNavigation />
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
