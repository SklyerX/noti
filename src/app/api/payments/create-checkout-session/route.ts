import { db } from "@/db";
import { env } from "@/env";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const BASE_URL =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

export async function POST(req: Request) {
  const { userId, email, priceId } = await req.json();

  const price = await stripe.prices.retrieve(priceId);

  console.log("CREATE_CHECKOUT_SESSIONS");

  if (!price) {
    console.log("Invalid price");
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const existingUser = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, userId),
  });

  if (!existingUser) {
    console.log("Invalid user");
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const customers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      return NextResponse.json(
        { error: "User already has an active subscription", redirect: true },
        { status: 400 }
      );
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${BASE_URL}/dashboard`,
      cancel_url: `${BASE_URL}/pricing`,
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
          email,
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      {
        status: 500,
      }
    );
  }
}
