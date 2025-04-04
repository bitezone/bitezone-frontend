import type { Metadata } from "next";

import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
