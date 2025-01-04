import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import type React from "react";
import LinkDiscord from "./link-discord";
import { cookies } from "next/headers";
import EmailVerificationBanner from "@/components/email-verification-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();
  const hideEmailVerification =
    (await cookies()).get("hide-email-verification")?.value === "true";
  const isSignedIn = !!user && !!session;

  if (!isSignedIn) return redirect("/login");

  if (!user.discordId) return <LinkDiscord />;

  return (
    <main>
      {!user.emailVerified && !hideEmailVerification && (
        <EmailVerificationBanner />
      )}
      {children}
    </main>
  );
}
