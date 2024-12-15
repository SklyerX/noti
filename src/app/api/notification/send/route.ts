import { db } from "@/db";
import { ApiKeyManager } from "@/lib/classes/api-key";
import { sendNotificationSchema } from "@/lib/validators/send-notification";
import { ZodError } from "zod";
import { apiKeysTable, eventTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DiscordNotificationClient } from "@/lib/classes/discord-notification";

export async function POST(req: Request) {
  const body = await req.json();
  const headers = req.headers;

  const apiKey = headers.get("x-api-key");

  if (!apiKey) {
    return new Response("Missing API key", {
      status: 401,
    });
  }

  const apiKeyManager = new ApiKeyManager();

  const hashedApiKey = apiKeyManager.hashAPIKey(apiKey);

  try {
    const { title, message, fields, metadata, color } =
      sendNotificationSchema.parse(body);

    const storedApiKey = await db.query.apiKeysTable.findFirst({
      where: (fields, { eq }) => eq(fields.key, hashedApiKey),
      with: {
        project: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!storedApiKey) {
      return new Response("Invalid API key", {
        status: 401,
      });
    }

    if (storedApiKey.isLive === false) {
      return new Response("API key is not live", {
        status: 401,
      });
    }

    const discordClient = new DiscordNotificationClient(
      storedApiKey.project.user.discordId as string
    );

    await discordClient.send({
      fields,
      title,
      description: message,
      timestamp: new Date().toISOString(),
      color: Number.parseInt(color),
    });

    const [event] = await db
      .insert(eventTable)
      .values({
        projectId: storedApiKey.projectId,
        apiKeyId: storedApiKey.id,
        title,
        message,
        fields,
        metadata,
        status: "sent",
      })
      .returning();

    await db
      .update(apiKeysTable)
      .set({
        usage: (storedApiKey.usage || 0) + 1,
        lastUsedAt: new Date(),
      })
      .where(eq(apiKeysTable.id, storedApiKey.id));

    return new Response(
      JSON.stringify({
        success: true,
        eventId: event.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    if (e instanceof ZodError) {
      return new Response(e.message, {
        status: 400,
      });
    }

    return new Response("Something went wrong, please try again later", {
      status: 500,
    });
  }
}
