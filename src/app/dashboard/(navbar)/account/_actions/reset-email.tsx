"use server";

import { db } from "@/db";
import { magicLinkTable, userTable } from "@/db/schema";
import { env } from "@/env";
import { actionClient } from "@/lib/safe-action";
import { sendEmail } from "@/lib/server";
import { getCurrentUser } from "@/lib/session";
import { ResetEmail } from "@/templates/reset-email-template";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().min(1).max(255),
});

export const resetEmailAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email } }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    console.log(email, user.email);

    if (email === user.email)
      throw new Error("You did not attempt to change your email.");

    const existingEmail = await db
      .select({
        userId: userTable.id,
        magicLinkId: magicLinkTable.id,
      })
      .from(userTable)
      .leftJoin(
        magicLinkTable,
        sql`${userTable.email} = ${magicLinkTable.metadata}->>'email'`
      )
      .where(eq(userTable.email, email.toLowerCase()))
      .limit(1);

    if (existingEmail.length > 0) throw new Error("Email already exists");

    const token = jwt.sign(
      { userId: user.id, newEmail: email.toLowerCase() },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await sendEmail(
      user.email,
      "Email change attempt",
      <ResetEmail name={user.name as string} token={token} />
    );
  });
