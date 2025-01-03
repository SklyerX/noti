import React from "react";
import Image from "next/image";
import ApiKeysImage from "../../../../../public/api-keys.webp";

export default function ApiKeysCard() {
  return (
    <div>
      <h3 className="text-xl font-semibold">Seamless API Key generation</h3>
      <p className="mt-1 text-muted-foreground">
        Generate API keys for your project in a few clicks.
      </p>
      <Image
        src={ApiKeysImage}
        alt="api-keys"
        width={800}
        height={400}
        placeholder="blur"
        className="rounded-lg mt-2"
      />
    </div>
  );
}
