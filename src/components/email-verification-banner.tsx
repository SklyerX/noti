"use client";

import { X } from "lucide-react";
import { handleCookieDismiss } from "./email-verification-dismiss";
import React from "react";

export default function EmailVerificationBanner() {
  const [shown, setShown] = React.useState(true);

  if (!shown) return null;

  const handleClick = () => {
    handleCookieDismiss();
    setShown(false);
  };

  return (
    <div className="flex justify-center items-center py-3 border-b bg-yellow-600/20 relative w-full">
      Please verify your email address
      <span className="mx-1 underline font-semibold">Resend</span>
      <div className="absolute top-3.5 right-4">
        <X className="size-4 cursor-pointer" onClick={handleClick} />
      </div>
    </div>
  );
}
