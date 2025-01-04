import type React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard-sidebar/app-sidebar";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import type { User } from "@/db/schema";
import { db } from "@/db";
import { redirect } from "next/navigation";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const user = await getCurrentUser();

  const project = await db.query.projectsTable.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.id, projectId), eq(fields.userId, user?.id as number)),
  });

  if (!project) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user as User} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
