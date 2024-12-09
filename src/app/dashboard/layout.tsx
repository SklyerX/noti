import { validateRequest } from "@/auth";
import DashboardNav from "@/components/dashboard-nav";
import { redirect } from "next/navigation";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();
  const isSignedIn = !!user && !!session;

  if (!isSignedIn) return redirect("/login");

  return (
    <main>
      <DashboardNav user={user} />
      {children}
    </main>
  );
}
