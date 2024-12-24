import { db } from "@/db";
import { type subscriptionStatusEnum, subscriptionTable } from "@/db/schema";
import { env } from "@/env";
import { STRIPE_PRICES } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const reqText = await req.text();
  return webhookHandler(reqText, req);
}

async function webhookHandler(reqText: string, req: Request) {
  const sig = req.headers.get("Stripe-Signature");

  if (!sig) {
    return new Response("Webhook signature not found", {
      status: 400,
    });
  }

  try {
    const event = await stripe.webhooks.constructEvent(
      reqText,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created");
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated");
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted");
      case "invoice.payment_succeeded":
        return handleInvoiceEvent(event, "succeeded");
      case "invoice.payment_failed":
        return handleInvoiceEvent(event, "failed");
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event);
      default:
        return new Response("Unhandled event type", {
          status: 400,
        });
    }
  } catch (e) {
    console.error("Stripe webhook event error:", e);
    return new Response("Error handling webhook", {
      status: 500,
    });
  }
}

const PRICE_TO_PLAN = Object.entries(STRIPE_PRICES).reduce(
  (acc, [pricing, priceId]) => {
    const planTier = pricing.startsWith("BASIC") ? "basic" : "plus";
    acc[priceId] = planTier;
    return acc;
  },
  {} as Record<string, "basic" | "plus">
);

async function handleSubscriptionEvent(
  event: Stripe.Event,
  action: "created" | "updated" | "deleted"
) {
  const subscription = event.data.object as Stripe.Subscription;
  const priceId = subscription.items.data[0].price.id;

  console.log("STRIPE::WEBHOOK", action, `status: ${subscription.status}`);

  const subscriptionData = {
    userId: Number.parseInt(subscription.metadata.userId),
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    stripePriceId: priceId,
    planTier: PRICE_TO_PLAN[priceId] ?? "free",
    status: subscription.cancel_at_period_end
      ? "cancel_pending" // New status for subscriptions that will cancel
      : (subscription.status as (typeof subscriptionStatusEnum.enumValues)[number]),
    startDate: new Date(subscription.start_date * 1000),
    endDate: subscription.ended_at
      ? new Date(subscription.ended_at * 1000)
      : null,
    cancelDate: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
    trialEndDate: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
    lastEventDate: new Date(),
    updatedAt: new Date(),
  };

  try {
    switch (action) {
      case "created":
        console.log("created", subscriptionData);
        await db.insert(subscriptionTable).values(subscriptionData);
        break;

      case "updated":
        console.log("updated", subscriptionData);
        await db
          .update(subscriptionTable)
          .set(subscriptionData)
          .where(eq(subscriptionTable.stripeSubscriptionId, subscription.id));
        break;

      case "deleted":
        console.log("deleted", subscriptionData);
        await db
          .update(subscriptionTable)
          .set({
            status: "canceled",
            endDate: new Date(),
            cancelDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.stripeSubscriptionId, subscription.id));
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error updating subscription:", e);
    return new Response("Error updating subscription", {
      status: 500,
    });
  }
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed"
) {
  const invoice = event.data.object as Stripe.Invoice;

  if (!invoice.subscription)
    return NextResponse.json({ success: false }, { status: 400 });

  console.log("STRIPE::INVOICE", status, invoice);

  try {
    if (status === "succeeded") {
      await db
        .update(subscriptionTable)
        .set({
          status: "active",
          updatedAt: new Date(),
        })
        .where(
          eq(
            subscriptionTable.stripeSubscriptionId,
            invoice.subscription as string
          )
        );
    } else {
      await db
        .update(subscriptionTable)
        .set({
          status: "past_due",
          updatedAt: new Date(),
        })
        .where(
          eq(
            subscriptionTable.stripeSubscriptionId,
            invoice.subscription as string
          )
        );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error handling invoice event:", e);
    return new Response("Error handling invoice event", {
      status: 500,
    });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const subscriptionId = session.subscription as string;
  const metadata = session.metadata;

  console.log("STRIPE::CHECKOUT", session, metadata);

  try {
    await stripe.subscriptions.update(subscriptionId, {
      metadata,
    });

    await db
      .update(subscriptionTable)
      .set({
        status: "active",
      })
      .where(eq(subscriptionTable.stripeSubscriptionId, subscriptionId));

    return NextResponse.json({
      status: 200,
      message: "Subscription metadata updated successfully",
    });
  } catch (e) {
    console.error("Error updating subscription metadata:", e);
    return NextResponse.json({
      status: 500,
      error: "Error updating subscription metadata",
    });
  }
}
