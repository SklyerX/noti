"use server";

import { db } from "@/db";
import { magicLinkTable } from "@/db/schema";
import { MAGIC_LINK_TOKEN_LENGTH, MAGIC_LINK_TTL } from "@/lib/constants";
import { actionClient } from "@/lib/safe-action";
import { sendEmail } from "@/lib/server";
import { getCurrentUser } from "@/lib/session";
import { generateRandomToken } from "@/lib/utils";
import { MagicLinkEmail } from "@/templates/magic-link-template";

export const sendEmailVerificationAction = actionClient.action(async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthenticated");

  const token = generateRandomToken(MAGIC_LINK_TOKEN_LENGTH);

  await db.insert(magicLinkTable).values({
    type: "login",
    metadata: { email: user.email.toLowerCase() },
    token,
    expiresAt: new Date(Date.now() + MAGIC_LINK_TTL),
  });

  await sendEmail(
    user.email,
    "Your verification link is ready",
    <MagicLinkEmail token={token} redirectTo="/api/auth/verify-email" />
  );
});
