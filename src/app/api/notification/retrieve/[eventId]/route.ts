import { db } from "@/db";
import { ApiKeyManager } from "@/lib/classes/api-key";

interface Props {
  params: Promise<{
    eventId: string;
  }>;
}

export async function GET(req: Request, { params }: Props) {
  const headers = req.headers;
  const { eventId } = await params;

  const apiKey = headers.get("x-api-key");

  if (!apiKey) {
    return new Response("Missing API key", {
      status: 401,
    });
  }

  const apiKeyManager = new ApiKeyManager();

  const hashedApiKey = apiKeyManager.hashAPIKey(apiKey);

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

  const event = await db.query.eventTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, eventId), eq(fields.apiKeyId, storedApiKey.id)),
    columns: {
      title: true,
      message: true,
      fields: true,
      metadata: true,
      errorMessage: true,
      retryCount: true,
      status: true,
      createdAt: true,
    },
  });

  if (!event) {
    return new Response("Event not found", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(event), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
