"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/db/schema";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/hooks/use-auth";
import { STRIPE_PRICES } from "@/lib/stripe";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    setStripePromise(loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!user) return toast.error("Please login or sign up to purchase");

    try {
      const { data } = await axios.post(
        "/api/payments/create-checkout-session",
        {
          userId: user.id.toString(),
          email: user.email,
          priceId,
        }
      );

      const stripe = await stripePromise;

      const response = await stripe?.redirectToCheckout({
        sessionId: data.sessionId,
      });

      return response;
    } catch (e) {
      console.error(e);
      if (e instanceof AxiosError) {
        if (e.status === 400 && e.response?.data.redirect)
          redirect("/dashboard/account/billing");
      }

      toast.error("Failed to checkout");
    }
  };

  return (
    <div className="mt-32">
      <AnimatePresence mode="wait">
        <div className="flex flex-col items-center gap-3">
          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-4xl font-semibold text-center"
          >
            Plans for Your Needs
          </motion.h3>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-center text-muted-foreground w-4/6"
          >
            Select the best plan that fits you and your needs best. Need more or
            less? Customize your subscription to fit your budget.
          </motion.p>
        </div>
        <div className="mt-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PricingSwitch onSwitch={(value) => setIsYearly(value === "1")} />
          </motion.div>
          <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
            {PLANS.map((plan, i) => (
              <PricingCard
                key={`${plan.title}-${i}`}
                index={i}
                plan={plan}
                user={user}
                isYearly={isYearly}
                handleCheckout={handleCheckout}
              />
            ))}
          </section>
        </div>
      </AnimatePresence>
    </div>
  );
}

interface PricingCardProps {
  plan: Plan;
  user: User | null;
  isYearly: boolean;
  handleCheckout: (priceId: string) => void;
  index: number;
}

const PricingCard = ({
  plan,
  isYearly,
  handleCheckout,
  user,
  index,
}: PricingCardProps) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 * index }}
    >
      <Card className="w-72 flex flex-col justify-between py-1 mx-auto sm:mx-0 relative">
        {plan.popular ? <BorderBeam /> : null}
        <div>
          <CardHeader className="pb-8 pt-4">
            {isYearly && plan.yearlyPrice && plan.monthlyPrice ? (
              <div className="flex justify-between">
                <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
                  {plan.title}
                </CardTitle>
                <div
                  className={cn(
                    "px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white",
                    {
                      "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ":
                        plan.popular,
                    }
                  )}
                >
                  Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}
                </div>
              </div>
            ) : (
              <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
                {plan.title}
              </CardTitle>
            )}
            <div className="flex gap-0.5">
              <h2 className="text-3xl font-bold">
                {plan.yearlyPrice && isYearly
                  ? `$${plan.yearlyPrice}`
                  : plan.monthlyPrice
                    ? `$${plan.monthlyPrice}`
                    : "Custom"}
              </h2>
              <span className="flex flex-col justify-end text-sm mb-1">
                {plan.yearlyPrice && isYearly
                  ? "/year"
                  : plan.monthlyPrice
                    ? "/month"
                    : null}
              </span>
            </div>
            <CardDescription className="pt-1.5 h-12">
              {plan.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {plan.features.map((feature: string) => (
              <div className="flex gap-2" key={feature}>
                <CheckCircle size={16} className="my-auto" />
                <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">
                  {feature}
                </p>
              </div>
            ))}
          </CardContent>
        </div>
        <CardFooter className="mt-2">
          <Button
            disabled={plan.disabled}
            onClick={() => {
              if (user?.id) {
                handleCheckout(
                  isYearly ? plan.priceIdYearly : plan.priceIdMonthly
                );
              } else {
                toast.error("Please login or sign up to purchase", {
                  description: "You must be logged in to make a purchase",
                  action: {
                    label: "Login",
                    onClick: () => {
                      router.push("/login");
                    },
                  },
                });
              }
            }}
            className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            type="button"
          >
            <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b fr om-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        <p className="text-black dark:text-white">Monthly</p>
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        <p className="text-black dark:text-white">Yearly</p>
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

interface PricingSwitchProps {
  onSwitch: (value: string) => void;
}

interface Plan {
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  priceIdMonthly: string;
  priceIdYearly: string;
  features: string[];
  disabled?: boolean;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    title: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with Noti",
    priceIdMonthly: "",
    priceIdYearly: "",
    features: [
      "100 API Calls per month",
      "1 Projects",
      "1 month data retention",
    ],
    disabled: true,
  },
  {
    title: "Basic",
    monthlyPrice: 10,
    yearlyPrice: 90,
    description:
      "Perfect for small businesses / startups with a medium sized user base",
    priceIdMonthly: STRIPE_PRICES.BASIC_MONTHLY,
    priceIdYearly: STRIPE_PRICES.BASIC_YEARLY,
    features: [
      "Everything in the free plan",
      "5000 API Calls per month",
      "10 Projects",
      "6 month data retention",
    ],
    popular: true,
  },
  {
    title: "Plus",
    monthlyPrice: 50,
    yearlyPrice: 200,
    description: "Dedicated support and infrastructure to fit your needs",
    priceIdMonthly: STRIPE_PRICES.PLUS_MONTHLY,
    priceIdYearly: STRIPE_PRICES.PLUS_YEARLY,
    features: [
      "Everything in the Basic plan",
      "Unlimited API Calls per month",
      "Unlimited Projects",
      "1 year data retention",
    ],
  },
];
