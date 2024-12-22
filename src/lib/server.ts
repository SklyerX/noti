import "server-only";

import { db } from "@/db";
import { env } from "@/env";
import { Resend } from "resend";
import type { ReactNode } from "react";

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

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(
  email: string,
  subject: string,
  react: ReactNode
) {
  const { data, error } = await resend.emails.send({
    from: "actions@noti.skylerx.ir",
    to: [email],
    subject,
    react,
  });

  if (error) throw new Error(error.message);

  return data;
}
