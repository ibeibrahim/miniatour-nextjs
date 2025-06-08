"use client";

import { Briefcase, Map, MountainSnow, Users } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMenu() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      icon: Users,
      label: "Users",
    },
    {
      href: "/dashboard/city",
      icon: Map,
      label: "Cities",
    },
    {
      href: "/dashboard/destination",
      icon: MountainSnow,
      label: "Destinations",
    },
    {
      href: "/dashboard/appointment",
      icon: Briefcase,
      label: "Appointments",
    },
  ];
  return (
    <SidebarGroup className="group-data-[collapsible=icon] pt-8">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu className="gap-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.href}>
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}