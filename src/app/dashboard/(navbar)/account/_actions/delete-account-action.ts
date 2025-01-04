"use server";

import { db } from "@/db";
import { projectsTable, subscriptionTable, userTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getCurrentUser, logout } from "@/lib/session";
import { eq } from "drizzle-orm";

export const deleteAccountAction = actionClient.action(async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");

  const subscription = await db.query.subscriptionTable.findFirst({
    where: (fields, { eq }) => eq(fields.userId, user.id),
  });

  if (subscription && subscription.status === "active")
    throw new Error("Cannot delete account while subscription is active");

  // would use db.transaction but NeonDB doesn't support it

  await db.delete(projectsTable).where(eq(projectsTable.userId, user.id));

  await db
    .update(userTable)
    .set({
      discordId: null,
      githubId: null,
      googleId: null,
      username: null,
      name: null,
      emailVerified: false,
      picture: "https://api.dicebear.com/9.x/initials/svg?seed=deleted",
      email: `deleted_${user.id}@deleted.com`,
      deletedAt: new Date(),
    })
    .where(eq(userTable.id, user.id));

  const result = await logout();

  return result;
});
