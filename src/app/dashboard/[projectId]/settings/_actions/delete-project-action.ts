"use server";

import { db } from "@/db";
import { apiKeysTable, eventTable, projectsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getCurrentUser } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  projectId: z.string(),
});

export const deleteProjectAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { projectId } }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    await db
      .delete(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.userId, user.id))
      );
  });
