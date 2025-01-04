"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import React from "react";

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (copied) return;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="icon"
      className="border rounded-md p-2 bg-transparent"
    >
      {copied ? <Check className="size-2" /> : <Copy className="size-2" />}
    </Button>
  );
}
