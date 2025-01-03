import Image from "next/image";
import React from "react";

export default function DiscordCard() {
  return (
    <div>
      <h3 className="text-xl font-semibold">Easy Discord Integration</h3>
      <p className="mt-1 text-muted-foreground">
        Integrate Noti-Saas with your Discord account and server in less than a
        few minutes.
      </p>
      <div className="mt-4 flex gap-2">
        <Image
          src="/bot-invite.webp"
          alt="Invite Bot"
          className="rounded-md object-cover"
          width={300}
          height={300}
        />
        <img
          src="/arrow.webp"
          alt="arrow-icon"
          className="size-10 rotate-180 self-center"
        />
        <Image
          src="/account-linking.webp"
          alt="Link Account"
          className="rounded-md object-cover"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
