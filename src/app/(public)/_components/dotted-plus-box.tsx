import { cn } from "@/lib/utils";
import type React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function DottedPlusBox({
  children,
  className,
  wrapperClassName,
}: Props) {
  const Icon = ({ className, ...rest }: any) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        {...rest}
        className={cn("dark:text-white text-black size-6 absolute", className)}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    );
  };

  return (
    <div
      className={cn(
        "border border-dashed border-zinc-400 dark:border-zinc-700 relative",
        wrapperClassName,
      )}
    >
      <Icon className="-top-3 -left-3" />
      <Icon className="-top-3 -right-3" />
      <Icon className="-bottom-3 -left-3" />
      <Icon className="-bottom-3 -right-3" />
      <div className={className}>{children}</div>
    </div>
  );
}
