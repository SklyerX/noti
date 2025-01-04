import { Check, DollarSign } from "lucide-react";
import React from "react";

export default function PricingCardInfo() {
  return (
    <div>
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <DollarSign className="size-5" />
        <span>Fair Pricing</span>
      </h3>
      <p className="mt-1 text-muted-foreground">
        Our pricing is transparent and fair. No hidden fees or surprises.
      </p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Check className="size-4" />
          <span>Free plan</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="size-4" />
          <span>No Hidden Fee's</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="size-4" />
          <span>Easy to switch</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="size-4" />
          <span>Easy to cancel</span>
        </div>
      </div>
    </div>
  );
}
