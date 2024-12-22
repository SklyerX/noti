import { getCurrentUser } from "@/lib/session";
import React from "react";
import EditEmail from "./_components/edit-email";
import type { User } from "@/db/schema";

export default async function Account() {
  const user = (await getCurrentUser()) as User;
  const isOAuth = !!user.githubId || !!user.googleId;

  return (
    <div>
      <h3 className="text-3xl font-semibold">Account</h3>

      <div className="mt-5 space-y-4 max-w-md">
        <div className="space-y-1">
          <h4 className="text-xl font-medium">Change Email</h4>
          <p className="text-muted-foreground">
            You can change your email address here.
          </p>
          {isOAuth ? (
            <p className="text-accent-foreground">
              You have linked your account with an external provider (Google or
              Github). Please note that after changing your email{" "}
              <span className="text-destructive">
                You will no longer be able to login with the old email
                regardless of the provider. A new account will be created for
                you if you do attempt so.
              </span>
            </p>
          ) : null}
        </div>
        <EditEmail email={user.email} />
      </div>
    </div>
  );
}
