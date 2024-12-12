import Steps from "@/components/discord-linking/steps";
import Link from "next/link";
import React from "react";

export default function LinkDiscord() {
  return (
    <div className="mx-auto container max-w-xl mt-10 space-y-5">
      <h2 className="text-4xl font-semibold">Hey 👋</h2>
      <div>
        <p className="text-lg">
          It turns out you haven't linked your Discord account yet.
        </p>
        <p className="text-lg">
          In order for this app to work, you need to link your Discord account.
        </p>
      </div>
      <Steps />
    </div>
  );
}
