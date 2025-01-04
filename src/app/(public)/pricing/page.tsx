import { Ubuntu_Mono } from "next/font/google";
import HyperText from "@/components/ui/hyper-text";
import { FadeText } from "@/components/ui/fade-text";

import PricingSection from "./_components/pricing-section";

const ubuntu_mono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-ubuntu-mono",
});

export default async function Pricing() {
  return (
    <div
      className={`container max-w-6xl mx-auto mt-5 p-5 ${ubuntu_mono.className}`}
    >
      <HyperText
        className="text-4xl font-bold text-black dark:text-white"
        text="Pricing"
      />
      <FadeText
        className="text-lg"
        direction="up"
        framerProps={{
          show: { transition: { delay: 0.4 } },
        }}
        text=" It doesn't take much to make a plan. All you need is dedication and the
        right plan."
      />
      <div className="mt-10">
        <PricingSection />
      </div>
    </div>
  );
}
