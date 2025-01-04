import { db } from "@/db";
import type { planTierEnum, User } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const subscription = await db.query.subscriptionTable.findFirst({
    where: (fields, { eq }) => eq(fields.userId, user.id),
  });

  console.log("SUBSCRIPTION", subscription);
  
  const responseObj: User & { planTier?: typeof planTierEnum.enumValues[number]} = { ...user };
  
  if (subscription?.planTier) {
    responseObj.planTier = subscription.planTier;
  }

  console.log("RESPONSE OBJECT", responseObj);

  return new Response(JSON.stringify(responseObj), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}