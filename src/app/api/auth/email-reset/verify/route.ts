import { createSession, generateSessionToken } from "@/auth";
import { db } from "@/db";
import { magicLinkTable, userTable } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/session";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    console.log("No token");
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard/account" },
    });
  }

  const magicLink = await db.query.magicLinkTable.findFirst({
    where: (fields, { eq }) => eq(fields.token, token),
  });

  if (!magicLink || magicLink.expiresAt < new Date()) {
    console.log("Magic link expired");
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard/account" },
    });
  }

  const metadata = magicLink.metadata as { email: string };
  const email = metadata.email;

  if (!email) {
    console.log("No email");
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard/account" },
    });
  }

  const [user] = await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(eq(userTable.email, email))
    .returning();

  console.log(user, "user updated");

  await db.delete(magicLinkTable).where(eq(magicLinkTable.id, magicLink.id));

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard/account",
    },
  });
}
