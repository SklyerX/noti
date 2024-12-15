"use server";

import { db } from "@/db";
import { apiKeysTable } from "@/db/schema";
import { ApiKeyManager } from "@/lib/classes/api-key";
import { actionClient } from "@/lib/safe-action";
import { getCurrentUser } from "@/lib/session";
import { createApiKeySchema } from "@/lib/validators/create-api-key";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const extendedSchema = createApiKeySchema.extend({
  projectId: z.string(),
});

export const createApiKeyAction = actionClient
  .schema(extendedSchema)
  .action(async ({ parsedInput: { name, isLive, projectId } }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const apiKeyManager = new ApiKeyManager();

    const { apiKey, hashedKey } = apiKeyManager.generateKey(isLive);

    await db.insert(apiKeysTable).values({
      name: name,
      projectId,
      isLive,
      key: hashedKey,
    });

    revalidatePath(`/dashboard/${projectId}/keys`);

    return {
      apiKey,
    };
  });
