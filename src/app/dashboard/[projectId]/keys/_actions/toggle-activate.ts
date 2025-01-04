"use server";

import { db } from "@/db";
import { apiKeysTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleActivateAction(id: string, projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const project = await db.query.projectsTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, projectId), eq(fields.userId, user.id)),
    with: {
      apiKeys: true,
    },
  });

  if (!project) throw new Error("Project not found");

  const apiKey = project.apiKeys.find((key) => key.id === id);

  if (!apiKey) throw new Error("API Key not found");

  await db
    .update(apiKeysTable)
    .set({
      isLive: !apiKey.isLive,
    })
    .where(and(eq(apiKeysTable.id, id), eq(apiKeysTable.projectId, projectId)));

  revalidatePath(`/dashboard/${projectId}/keys`);
}
