"use server";

import { db } from "@/db";
import { eventTable, projectsTable, userTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getCurrentUser } from "@/lib/session";
import { and, desc, eq } from "drizzle-orm";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { z } from "zod";

const schema = z.object({
  projectId: z.string(),
  limit: z.number().min(1).max(50).default(10),
  page: z.number().min(1).default(1), // Changed from offset to page
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const fetchEventsAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const { success } = await ratelimit.limit(String(user.id));

    if (!success) throw new Error("Rate limit exceeded");

    const { page, limit, projectId } = parsedInput;
    const offset = (page - 1) * limit;

    const eventCount = await db.$count(
      eventTable,
      eq(eventTable.projectId, projectId)
    );

    const events = await db
      .select({
        id: eventTable.id,
        title: eventTable.title,
        message: eventTable.message,
        status: eventTable.status,
        fields: eventTable.fields,
        errorMessage: eventTable.errorMessage,
        retryCount: eventTable.retryCount,
        createdAt: eventTable.createdAt,
        metadata: eventTable.metadata,
      })
      .from(eventTable)
      .innerJoin(projectsTable, eq(eventTable.projectId, projectsTable.id))
      .innerJoin(userTable, eq(projectsTable.userId, userTable.id))
      .where(
        and(
          eq(projectsTable.userId, user.id),
          eq(eventTable.projectId, projectId)
        )
      )
      .limit(limit)
      .offset(offset)
      .orderBy(desc(eventTable.createdAt))
      .execute();

    return {
      events,
      metadata: {
        eventCount,
        totalPages: Math.ceil(eventCount / limit),
        currentPage: page,
      },
    };
  });
