"use server";

import { db } from "@/db";
import { magicLinkTable, userTable } from "@/db/schema";
import { MAGIC_LINK_TOKEN_LENGTH, MAGIC_LINK_TTL } from "@/lib/constants";
import { actionClient } from "@/lib/safe-action";
import { sendEmail } from "@/lib/server";
import { generateRandomToken } from "@/lib/utils";
import { magicLinkSchema } from "@/lib/validators/magic-link";
import { MagicLinkEmail } from "@/templates/magic-link-template";
import { eq } from "drizzle-orm";

export const sendMagicLinkAction = actionClient
  .schema(magicLinkSchema)
  .action(async ({ parsedInput: { email } }) => {
    const token = generateRandomToken(MAGIC_LINK_TOKEN_LENGTH);

    const existingEmail = await db
      .select({
        userId: userTable.id,
        magicLinkId: magicLinkTable.id,
      })
      .from(userTable)
      .leftJoin(magicLinkTable, eq(userTable.email, magicLinkTable.email))
      .where(eq(userTable.email, email.toLowerCase()))
      .limit(1);

    if (existingEmail.length > 0) throw new Error("Email already exists");

    await db.insert(magicLinkTable).values({
      email: email,
      token,
      expiresAt: new Date(Date.now() + MAGIC_LINK_TTL),
    });

    await sendEmail(
      email,
      "Your magic link is ready",
      <MagicLinkEmail token={token} />
    );
  });
