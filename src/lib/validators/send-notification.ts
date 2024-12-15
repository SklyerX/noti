import { z } from "zod";

export const sendNotificationSchema = z.object({
  title: z.string().min(1).max(255),
  color: z
    .string()
    .regex(/^0x[0-9A-Fa-f]{6}$/)
    .optional()
    .default("0xffffff"),
  message: z.string().min(1).max(255).optional(),
  fields: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
  metadata: z.record(z.unknown()).optional(),
});
