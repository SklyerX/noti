"use server";

import { db } from "@/db";
import { apiKeysTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteAPIKeyAction(id: string, projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const project = await db.query.projectsTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, projectId),
  });

  if (!project) throw new Error("Project not found");

  await db
    .delete(apiKeysTable)
    .where(and(eq(apiKeysTable.id, id), eq(apiKeysTable.projectId, projectId)));

  revalidatePath(`/dashboard/${projectId}/keys`);
}
