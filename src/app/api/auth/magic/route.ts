import { createSession, generateSessionToken } from "@/auth";
import { db } from "@/db";
import { magicLinkTable, userTable } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/session";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  const magicLink = await db.query.magicLinkTable.findFirst({
    where: (fields, { eq }) => eq(fields.token, token),
  });

  if (!magicLink || magicLink.expiresAt < new Date()) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  const metadata = magicLink.metadata as { email: string };
  const email = metadata.email;

  if (!email) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  const emailFirstPart = email.split("@")[0];
  const formattedName = emailFirstPart.replaceAll(".", "");

  const [user] = await db
    .insert(userTable)
    .values({
      email: email,
      username: formattedName,
      name: formattedName,
      picture: `https://api.dicebear.com/9.x/glass/svg?seed=${formattedName}`,
    })
    .returning();

  await db.delete(magicLinkTable).where(eq(magicLinkTable.id, magicLink.id));

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
    },
  });
}
