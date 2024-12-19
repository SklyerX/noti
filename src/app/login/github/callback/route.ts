import { generateSessionToken, createSession } from "@/auth";
import { cookies } from "next/headers";

import type { OAuth2Tokens } from "arctic";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { github } from "@/auth";
import { setSessionTokenCookie } from "@/lib/session";
import { createOAuthErrorResponse, OAuthErrorCode } from "@/lib/error";

interface GithubUserEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
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
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });

  const githubUserEmail = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });

  const githubUser = await githubUserResponse.json();
  const githubEmailResponse =
    (await githubUserEmail.json()) as Array<GithubUserEmailResponse>;

  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;
  const githubAvatarUrl = githubUser.avatar_url;

  const githubEmail = githubEmailResponse.find((x) => x.primary);

  if (!githubEmail)
    return createOAuthErrorResponse(OAuthErrorCode.GITHUB_EMAIL_MISSING);

  const existingEmail = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.email, githubEmail.email),
  });

  if (existingEmail) {
    return createOAuthErrorResponse(OAuthErrorCode.EMAIL_EXISTS);
  }

  const existingUser = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.githubId, githubUser),
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
      githubId: githubUserId,
      email: githubEmail.email,
      picture: githubAvatarUrl,
      name: githubUsername,
      username: githubUsername,
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
