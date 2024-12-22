import { db } from "@/db";
import { magicLinkTable, userTable } from "@/db/schema";
import { env } from "@/env";
import { sendEmail } from "@/lib/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { MagicLinkEmail } from "@/templates/magic-link-template";
import { generateRandomToken } from "@/lib/utils";
import { MAGIC_LINK_TOKEN_LENGTH, MAGIC_LINK_TTL } from "@/lib/constants";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }

  const payload = jwt.verify(token, env.JWT_SECRET) as {
    userId: number;
    newEmail: string;
    iat: number;
    exp: number;
  };

  if (payload.exp > Date.now()) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }

  await db
    .update(userTable)
    .set({ email: payload.newEmail, emailVerified: false })
    .where(eq(userTable.id, payload.userId));

  const newToken = generateRandomToken(MAGIC_LINK_TOKEN_LENGTH);

  await db.insert(magicLinkTable).values({
    type: "email_change",
    metadata: { email: payload.newEmail.toLowerCase() },
    token: newToken,
    expiresAt: new Date(Date.now() + MAGIC_LINK_TTL),
  });

  await sendEmail(
    payload.newEmail,
    "Verify your new email",
    <MagicLinkEmail
      token={newToken}
      redirectTo="/api/auth/email-reset/verify"
    />
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard/account",
    },
  });
}
