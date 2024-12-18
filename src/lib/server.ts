import { db } from "@/db";
import "server-only";

export function getBaseUrl(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  return isProduction && vercelUrl
    ? `https://${vercelUrl}`
    : "http://localhost:3000";
}

export async function getUserPlanTier(userId: number) {
  const plan = await db.query.subscriptionTable.findFirst({
    where: (fields, { eq }) => eq(fields.userId, userId),
  });

  return plan?.planTier ?? "free";
}
