"use server";

import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getUserPlanTier } from "@/lib/server";
import { getCurrentUser } from "@/lib/session";
import { PLAN_LIMITS } from "@/lib/utils";
import { eq } from "drizzle-orm";
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

    const projectsCount = await db.$count(
      projectsTable,
      eq(projectsTable.userId, user.id)
    );
    const userPlanTier = await getUserPlanTier(user.id);

    if (projectsCount >= PLAN_LIMITS[userPlanTier].maxProjects) {
      throw new Error(
        "You have reached the maximum number of projects for your plan"
      );
    }

    await db.insert(projectsTable).values({
      name: parsedInput.name,
      userId: user.id,
    });

    revalidatePath("/dashboard");
  });
