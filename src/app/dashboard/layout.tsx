import { validateRequest } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import type React from "react";
import LinkDiscord from "./link-discord";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();
  const isSignedIn = !!user && !!session;

  if (!isSignedIn) return redirect("/login");

  if (!user.discordId) return <LinkDiscord />;

  return <main>{children}</main>;
}
