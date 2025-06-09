import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/styles/font";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Miniatour Admin",
  description: "Admin dashboard for Miniatour Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <main>{children}</main>
        <Toaster position="top-center"/>
      </body>
    </html>
  );
}
