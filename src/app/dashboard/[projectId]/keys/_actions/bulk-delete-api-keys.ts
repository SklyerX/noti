"use server";

import { db } from "@/db";
import { apiKeysTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function bulkDeleteAPIKeysAction(
  ids: Array<string>,
  projectId: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const project = await db.query.projectsTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, projectId), eq(fields.userId, user.id)),
  });

  if (!project) throw new Error("Project not found");

  await db
    .delete(apiKeysTable)
    .where(
      and(inArray(apiKeysTable.id, ids), eq(apiKeysTable.projectId, projectId))
    );

  revalidatePath(`/dashboard/${projectId}/keys`);
}
