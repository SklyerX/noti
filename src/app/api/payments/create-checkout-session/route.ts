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

  // TODO: CHECK to see if userId is valid, email is valid, and if priceId is from our list of plans

  console.log("CHECKOUT::STRIPE", userId, priceId);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
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

    console.log("CHECKOUT::STRIPE", session);

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
