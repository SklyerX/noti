import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  isLive: z.boolean().default(false),
});

export type CreateApiKeySchema = z.infer<typeof createApiKeySchema>;
