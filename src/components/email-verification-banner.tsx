"use client";

import { Minus, X } from "lucide-react";
import { handleCookieDismiss } from "./email-verification-dismiss";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { sendEmailVerificationAction } from "./send-email-verification";

export default function EmailVerificationBanner() {
  const [shown, setShown] = React.useState(true);
  const { execute, status, result } = useAction(sendEmailVerificationAction);

  if (!shown) return null;

  const handleClick = () => {
    handleCookieDismiss();
    setShown(false);
  };

  useEffect(() => {
    if (status === "hasSucceeded") {
      toast.success("Email sent!", {
        description: "Please check your inbox for a verification email.",
      });
    }
    if (status === "hasErrored") {
      toast.error("Failed to send email!", {
        description: result.serverError || "Please try again later.",
      });
    }
  }, [status]);

  return (
    <div className="flex justify-center items-center py-3 border-b bg-yellow-600/20 relative w-full space-x-1">
      <span>Please verify your email address</span>
      <Minus className="size-4" />
      <Button
        onClick={() => execute()}
        size="sm"
        variant="link"
        className="underline font-semibold text-base"
      >
        Resend
      </Button>
      <div className="absolute top-3.5 right-4">
        <X className="size-4 cursor-pointer" onClick={handleClick} />
      </div>
    </div>
  );
}
