"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Steps() {
  return (
    <div>
      <div className="border-l">
        {STEPS.map((step, i) => (
          <div
            className={cn(
              "relative ml-6",
              STEPS.length - 1 === i ? "pb-8" : "pb-16"
            )}
            key={step.title}
          >
            <div className="absolute -left-[38px] bg-muted flex items-center justify-center w-7 h-7 rounded-full border">
              {i + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <div className="mt-2">{step.component}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  {
    title: "Discord Account Setup",
    component: (
      <div>
        If you do not have a discord account, please create one{" "}
        <Link
          href="https://discord.com/register"
          target="_blank"
          className="text-blue-500 underline"
        >
          here
        </Link>
      </div>
    ),
  },
  {
    title: "Bot Linking",
    component: (
      <div>
        <p>
          Next up, create a server and invite the bot to it. You can do this by
          clicking the button below.{" "}
          <Link
            href="https://discord.com/oauth2/authorize?client_id=1316773226717904896"
            className="text-blue-500 underline"
          >
            Click here
          </Link>{" "}
          select <strong>add to server</strong> and select your server. After
          the bot is successfully in your discord server continue to the next
          and final step.
        </p>
        <p className="italic text-sm mt-5">
          Please note that this will not work until you have actually linked
          your discord account. The bot will remain inactive
        </p>
      </div>
    ),
  },
  {
    title: "Account Linking",
    component: (
      <div>
        Lastly, link your discord account with your noti-saas account.{" "}
        <Link href="/api/discord-connect" className="text-blue-500 underline">
          Click here
        </Link>{" "}
        to start linking.
      </div>
    ),
  },
];
