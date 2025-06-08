import type { Metadata } from "next";
import "../globals.css";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import ProtectedHeader from "@/components/protected-header";

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
    <UserProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <ProtectedHeader />
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
