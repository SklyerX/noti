"use server";

import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
});

export const createProjectAction = actionClient
  .schema(createProjectSchema)
  .action(async ({ parsedInput }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    await db.insert(projectsTable).values({
      name: parsedInput.name,
      userId: user.id,
    });

    revalidatePath("/dashboard");
  });
