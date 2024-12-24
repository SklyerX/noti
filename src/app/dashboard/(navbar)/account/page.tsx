import { getCurrentUser } from "@/lib/session";
import EditEmail from "./_components/edit-email";
import type { User } from "@/db/schema";
import DeleteAccount from "./_components/delete-account";
import { db } from "@/db";
import Link from "next/link";

export default async function Account() {
  const user = (await getCurrentUser()) as User;
  const isOAuth = !!user.githubId || !!user.googleId;

  const subscription = await db.query.subscriptionTable.findFirst({
    where: (fields, { eq }) => eq(fields.userId, user.id),
  });

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
        <div className="space-y-1">
          <h4 className="text-xl font-medium">Delete Account</h4>
          <p className="text-muted-foreground">
            You can delete all the data associated with your account.
          </p>
          <p>
            To delete your account, please cancel your Noti subscription first.
            <Link href="/dashboard/account/billing" className="underline mx-1">
              Manage your subscription
            </Link>
          </p>
        </div>
        <DeleteAccount disabled={subscription?.status === "active" || false} />
      </div>
    </div>
  );
}
