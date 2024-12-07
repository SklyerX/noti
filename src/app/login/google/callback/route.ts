// app/login/google/callback/route.ts
import { setSessionTokenCookie } from "@/lib/session";
import { createSession, generateSessionToken, google } from "@/auth";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import { ObjectParser } from "@pilcrowjs/object-parser";

import type { OAuth2Tokens } from "arctic";
import { db } from "@/db";
import { userTable } from "@/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const cookieStore = await cookies();

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  console.log(claims);

  console.log(claimsParser.getString("sub"));

  const googleId = claimsParser.getString("sub");
  const name = claimsParser.getString("name");
  const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");

  const existingUser = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.googleId, googleId),
  });

  if (existingUser) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const [user] = await db
    .insert(userTable)
    .values({
      googleId: googleId,
      email,
      picture,
      name,
    })
    .returning();

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
