import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import type { User } from "@/db/schema";
import { env } from "@/env";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const BASE_URL =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_URL
    ? process.env.NEXT_PUBLIC_URL
    : "http://localhost:3000";

export default async function Billing() {
  const user = (await getCurrentUser()) as User;

  const subscription = await db.query.subscriptionTable.findFirst({
    where: (fields, { eq }) => eq(fields.userId, user.id),
  });

  let portalSessionUrl: string | null = null;

  if (subscription) {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${BASE_URL}/dashboard/account/billing`,
    });

    portalSessionUrl = portalSession.url;
  }

  return (
    <div>
      <h3 className="text-3xl font-semibold">Billing</h3>
      <div className="mt-5">
        <div>Current Plan: {subscription ? subscription.planTier : "Free"}</div>
        <div>
          Status: {subscription ? subscription.status : "Not Subscribed"}
        </div>
        {portalSessionUrl ? (
          <Link
            href={portalSessionUrl}
            className={buttonVariants({ variant: "link", className: "mt-2" })}
            target="_blank"
          >
            Manage Billing
          </Link>
        ) : null}
      </div>
    </div>
  );
}
