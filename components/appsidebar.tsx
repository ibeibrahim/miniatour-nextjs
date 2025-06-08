"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMenu } from "./nav-menu";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="hidden md:flex">
        <Image src="/logo.png" alt="Logo" width={60} height={40}/>
        <SidebarTrigger></SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu/>
      </SidebarContent>
    </Sidebar>
  );
}