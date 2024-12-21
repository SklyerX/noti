import { db } from "@/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  let currentPlan: string | null = null;

  if (user) {
    const subscription = await db.query.subscriptionTable.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id),
    });

    console.log("SUBSCRIPTION", subscription);

    currentPlan = subscription?.planTier ?? null;
  }

  console.log("CURRENT PLAN", currentPlan);

  return new Response(JSON.stringify({ ...user, planTier: currentPlan }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
