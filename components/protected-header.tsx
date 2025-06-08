"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "./ui/skeleton";

const ProtectedHeader = () => {
  const { user, loading, error, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-end px-4 bg-white gap-2 transition-[width,height] ease-linear">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex items-center gap-x-2">
        {loading ? (
          // Loading skeleton
          <div className="flex items-center space-x-2 border rounded-xl p-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-4 h-4" />
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer space-x-2 border rounded-xl p-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.photo_url!} />
                  <AvatarFallback>
                    <div className="text-sm font-semibold">
                      {user.name.charAt(0)}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-xs">
                  {user.name}
                </span>
                <ChevronDown className="w-4 pt-0.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/dashboard/profile" passHref>
                <DropdownMenuItem asChild>
                  <div>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </div>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/about" passHref>
                <DropdownMenuItem asChild>
                  <div>
                    <HelpCircle className="w-4 h-4 mr-2" /> Help
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={handleLogout}
                
                className="focus:bg-red-50 focus:text-red-500"
              >
                <LogOut className="w-4 h-4 mr-2 " /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        <SidebarTrigger className="md:hidden [&>svg]:w-5 [&>svg]:h-5" />
      </div>
    </header>
  );
};

export default ProtectedHeader;