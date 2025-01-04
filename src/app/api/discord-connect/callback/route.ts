import { db } from "@/db";
import { userTable } from "@/db/schema";
import { env } from "@/env";
import { getBaseUrl } from "@/lib/server";
import { getCurrentUser } from "@/lib/session";

import axios from "axios";
import { eq } from "drizzle-orm";

const DISCORD_OAUTH_URL = "https://discord.com/api/oauth2/token";

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");

  const user = await getCurrentUser();

  if (!user) return new Response("Not authenticated", { status: 401 });

  if (!code) return new Response("No code", { status: 400 });

  try {
    const tokenResponse = await axios.post(
      DISCORD_OAUTH_URL,
      buildParams(code),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const discordUserResponse = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data } = discordUserResponse;

    await db
      .update(userTable)
      .set({
        discordId: data.id,
      })
      .where(eq(userTable.id, user.id));

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (e) {
    console.error(e);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/error",
      },
    });
  }
}

function buildParams(code: string): URLSearchParams {
  const baseUrl = getBaseUrl();

  return new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: `${baseUrl}/api/discord-connect/callback`,
    scope: "identify messages.read",
  });
}
