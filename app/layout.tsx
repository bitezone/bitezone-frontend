import type { Metadata } from "next";

import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/context/auth-context";
import BottomNavigation from "@/components/BottomNavigation";
import { SideBarNavigation } from "@/components/SideBarNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.oswegodining.com"),
  title: "SUNY Oswego Dining Halls - Menus, Hours & Nutrition Info",
  description:
    "View dining hall menus and hours for SUNY Oswego. Fast access to all campus dining halls - Lakeside Dining Hall, Cooper Dining Hall and Pathfinder Dining Hall. Updated daily.",
  keywords: [
    "oswego dining",
    "suny oswego dining hall",
    "dining hall menu",
    "oswego dining halls",
    "suny oswego campus dining",
  ],
  alternates: {
    canonical: "/", // Add this
  },
  openGraph: {
    title: "SUNY Oswego Dining Halls",
    description: "Fast, easy access to SUNY Oswego dining information",
    url: "https://www.oswegodining.com",
    siteName: "Oswego Dining",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Oswego Dining",
              url: "https://www.oswegodining.com",
              logo: "https://www.oswegodining.com/android-chrome-512x512.png",
              description: "SUNY Oswego dining hall menus and hours",
              sameAs: [
              ],
            }),
          }}
        />
      </head>
      <body>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID!} />
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
                <SpeedInsights />
              </main>
            </SidebarProvider>

            <div className="block md:hidden">
              <BottomNavigation />
            </div>
          </AuthProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
