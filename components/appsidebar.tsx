"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMenu } from "./nav-menu";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={`flex mt-2 ${open ? "items-start" : "items-center"}`}>
        {open ? (
          <Image src="/logo-full.png" alt="Logo" width={150} height={50} />
        ) : (
          <Image src="/logo.png" alt="Logo" width={25} height={25} />
        )}
        <SidebarTrigger></SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu />
      </SidebarContent>
    </Sidebar>
  );
}
