import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { AnimatedList } from "@/components/ui/animated-list";
import Notification from "./_components/notification";
import ImageZoom from "./_components/image-zoom";
import DottedPlusBox from "./_components/dotted-plus-box";
import ApiKeysCard from "./_components/cards/api-keys-card";
import DocsCard from "./_components/cards/docs-card";
import DiscordCard from "./_components/cards/discord-card";
import PricingCardInfo from "./_components/cards/pricing-card-info";

const notifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",

    icon: "💸",
    color: "#00C9A7",
    projectName: "SAAS",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
    projectName: "SAAS",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
    projectName: "SAAS",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
    projectName: "SAAS",
  },
];

export default function Page() {
  return (
    <div className="container-wrapper mt-10">
      <div className="px-4 xl:px-6 2xl:px-4 mx-auto max-w-[1036px]">
        <h3 className="text-4xl md:text-5xl font-semibold">
          Noti Saas,a a better solution <br /> for your live notification needs
        </h3>
        <p className="mt-4">
          Track every live important event of your product, monitor potential
          issues or opportunities.
        </p>
        <Link href="/login" className={buttonVariants({ className: "mt-4" })}>
          Start Tracking <ArrowRight className="size-4" />
        </Link>
        <div className="relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl mt-5">
          <AnimatedList>
            {notifications.map((item, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Notification {...item} key={idx} />
            ))}
          </AnimatedList>
        </div>
      </div>
      <ImageZoom />
      <div className="px-4 xl:px-6 2xl:px-4 mx-auto max-w-[1236px] grid grid-cols1 md:grid-cols-12 gap-4 mt-5 lg:mt-0">
        <DottedPlusBox wrapperClassName="md:col-span-3" className="p-5">
          <DocsCard />
        </DottedPlusBox>
        <DottedPlusBox wrapperClassName="md:col-span-9" className="p-5">
          <ApiKeysCard />
        </DottedPlusBox>
        <DottedPlusBox wrapperClassName="md:col-span-9" className="p-5">
          <DiscordCard />
        </DottedPlusBox>
        <DottedPlusBox wrapperClassName="md:col-span-3" className="p-5">
          <PricingCardInfo />
        </DottedPlusBox>
      </div>
    </div>
  );
}
