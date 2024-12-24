import { db } from "@/db";
import { magicLinkTable, userTable } from "@/db/schema";
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

  await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(eq(userTable.email, email));

  await db.delete(magicLinkTable).where(eq(magicLinkTable.id, magicLink.id));

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
    },
  });
}
