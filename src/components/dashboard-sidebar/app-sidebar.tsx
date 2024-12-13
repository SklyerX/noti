"use client";

import type * as React from "react";
import { Bell, Book, Command, Home, Settings, Webhook } from "lucide-react";

import { NavProjects } from "./nav-main-options";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { User } from "@/db/schema";

interface Props extends React.ComponentProps<typeof Sidebar> {
  user: Pick<User, "name" | "email" | "picture">;
}

export function AppSidebar({ user, ...props }: Props) {
  const { projectId } = useParams();

  const data = {
    mainOptions: [
      {
        name: "Overview",
        url: `/dashboard/${projectId}`,
        icon: Home,
      },
      {
        name: "Events",
        url: `/dashboard/${projectId}/events`,
        icon: Bell,
      },
      {
        name: "Keys",
        url: `/dashboard/${projectId}/keys`,
        icon: Webhook,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: `/dashboard/${projectId}/settings`,
        icon: Settings,
      },
      {
        title: "Documentation",
        url: `/dashboard/${projectId}/settings`,
        icon: Book,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">My Noti</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.mainOptions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
