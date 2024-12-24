import { db } from "@/db";
import { ApiKeyManager } from "@/lib/classes/api-key";
import { sendNotificationSchema } from "@/lib/validators/send-notification";
import { ZodError } from "zod";
import { apiKeysTable, eventTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DiscordNotificationClient } from "@/lib/classes/discord-notification";
import { getRedisClient } from "@/lib/redis";
import { PLAN_LIMITS } from "@/lib/utils";

async function checkAPILimits(
  apiKey: string,
  userPlan: "free" | "basic" | "plus"
) {
  const redis = getRedisClient();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const key = `usage:${apiKey}`;

  const monthlyLimit = PLAN_LIMITS[userPlan];

  const usage = await redis.hget(key, currentMonth);
  const currentUsage = usage ? Number.parseInt(usage as string) : 0;

  console.log("CHECK_API:", usage, currentUsage);

  if (currentUsage >= monthlyLimit.maxApiCalls) {
    return {
      allowed: false,
      limit: monthlyLimit.maxApiCalls,
      remaining: 0,
      usage: currentUsage,
    };
  }

  await redis.hincrby(key, currentMonth, 1);

  return {
    allowed: true,
    limit: monthlyLimit.maxApiCalls,
    remaining: monthlyLimit.maxApiCalls - currentUsage - 1, // subtract 1 because we just incremented
    usage: currentUsage + 1, // add 1 because we just incremented
  };
}
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

    const userPlan = await db.query.subscriptionTable.findFirst({
      where: (fields, { eq }) =>
        eq(fields.userId, storedApiKey.project.user.id),
    });

    const limitResult = await checkAPILimits(
      storedApiKey.id,
      userPlan?.planTier || "free"
    );

    if (limitResult.allowed === false)
      return new Response(
        JSON.stringify({
          success: false,
          error: "API Limit Exceeded",
          info: {
            remaining: limitResult.remaining,
            limit: limitResult.limit,
            usage: limitResult.usage,
          },
        }),
        {
          status: 429,
        }
      );

    const discordClient = new DiscordNotificationClient(
      storedApiKey.project.user.discordId as string
    );

    const { error } = await discordClient.send({
      fields,
      title,
      description: message,
      timestamp: new Date().toISOString(),
      color: Number.parseInt(color),
      footer: {
        text: `Project - ${storedApiKey.project.name}`,
      },
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
        status: error ? "failed" : "sent",
        errorMessage: error?.message,
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
        eventId: event.id,
        success: error === null,
        error: error?.message,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
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
