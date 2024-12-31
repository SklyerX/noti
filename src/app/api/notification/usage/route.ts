import { db } from "@/db";
import { ApiKeyManager } from "@/lib/classes/api-key";
import { apiKeysTable } from "@/db/schema";
import { getRedisClient } from "@/lib/redis";
import { PLAN_LIMITS } from "@/lib/utils";

interface UsageResponse {
  success: boolean;
  error?: string;
  data?: {
    current: {
      usage: number;
      remaining: number;
      limit: number;
    };
    history: {
      month: string;
      usage: number;
    }[];
    apiKey: {
      name: string;
      totalUsage: number;
      lastUsedAt: Date | null;
    };
    nextReset: string;
  };
}

export async function GET(req: Request) {
  const headers = req.headers;
  const apiKey = headers.get("x-api-key");

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing API key",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const apiKeyManager = new ApiKeyManager();
  const hashedApiKey = apiKeyManager.hashAPIKey(apiKey);

  try {
    // Get API key details from database
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
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid API key",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const userPlan = await db.query.subscriptionTable.findFirst({
      where: (fields, { eq }) =>
        eq(fields.userId, storedApiKey.project.user.id),
    });

    const planTier = userPlan?.planTier || "free";
    const monthlyLimit = PLAN_LIMITS[planTier].maxApiCalls;

    const redis = getRedisClient();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const key = `usage:${storedApiKey.id}`;

    const allUsage = (await redis.hgetall(key)) || {};

    const monthlyUsageHistory = Object.entries(allUsage)
      .map(([month, usage]) => ({
        month,
        usage: Number(usage),
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    const currentUsage = Number(allUsage[currentMonth] || 0);

    const today = new Date();
    const creationDate = new Date(storedApiKey.createdAt);

    const currentReset = new Date(
      today.getFullYear(),
      today.getMonth(),
      creationDate.getDate(),
    );

    if (today > currentReset) {
      currentReset.setMonth(currentReset.getMonth() + 1);
    }

    const nextReset = currentReset.toISOString();

    const response: UsageResponse = {
      success: true,
      data: {
        current: {
          usage: currentUsage,
          remaining: Math.max(0, monthlyLimit - currentUsage),
          limit: monthlyLimit,
        },
        history: monthlyUsageHistory,
        apiKey: {
          name: storedApiKey.name,
          totalUsage: storedApiKey.usage || 0,
          lastUsedAt: storedApiKey.lastUsedAt,
        },
        nextReset,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Something went wrong, please try again later",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
