import { env } from "@/env";
import { getBaseUrl } from "@/lib/server";
import { redirect } from "next/navigation";

export function GET(req: Request) {
  const baseUrl = getBaseUrl();
  const authUrl = buildDiscordAuthUrl(baseUrl);

  redirect(authUrl);
}

function buildDiscordAuthUrl(baseUrl: string): string {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${baseUrl}/api/discord-connect/callback`,
    scope: "identify messages.read",
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}
